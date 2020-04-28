
import getTags from '../getTagsFor'

// example data from https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getFunctionConfiguration-property
const lambdaarn = "arn:aws:lambda:us-west-2:123456789012:function:myFunction"
const masterarn = `${lambdaarn}LE:2`
const edgearn = `${masterarn.replace('us-west-2', 'us-east-1')}`
const lambdadb = {}
function resetdb() {
  lambdadb[lambdaarn] = {
    config: {
      CodeSha256: "LQT+0DHxxxxcfwLyQjzoEFKZtdqQjHXanlSdfXBlEW0VA=", 
      CodeSize: 123, 
      DeadLetterConfig: {}, 
      Description: "", 
      Environment: {}, 
      FunctionArn: "arn:aws:lambda:us-west-2:123456789012:function:myFunction", 
      FunctionName: "myFunction", 
      Handler: "index.handler", 
      KMSKeyArn: "", 
      LastModified: "2016-11-21T19:49:20.006+0000", 
      MemorySize: 128, 
      Role: "arn:aws:iam::123456789012:role/lambda_basic_execution", 
      Runtime: "python2.7", 
      Timeout: 123, 
      Version: "$LATEST", 
      VpcConfig: {}
    },
    tags: { Tags: {
      'foo': 'bar',
      'baz': 'quux'
    }}
  }
  lambdadb[edgearn] = {
    config: {
      CodeSha256: "LQT+0DHxxxxcfwLyQjzoEFKZtdqQjHXanlSdfXBlEW0VA=", 
      CodeSize: 123, 
      DeadLetterConfig: {}, 
      Description: "", 
      Environment: {}, 
      FunctionArn: edgearn,
      FunctionName: "myFunctionLE", 
      MasterArn: masterarn,
      Handler: "index.handler", 
      KMSKeyArn: "", 
      LastModified: "2016-11-21T19:49:20.006+0000", 
      MemorySize: 128, 
      Role: "arn:aws:iam::123456789012:role/lambda_basic_execution", 
      Runtime: "python2.7", 
      Timeout: 123, 
      Version: "2", 
      VpcConfig: {}
    }
  }
  lambdadb[masterarn] = {
    config: {
      CodeSha256: "LQT+0DHxxxxcfwLyQjzoEFKZtdqQjHXanlSdfXBlEW0VA=", 
      CodeSize: 123, 
      DeadLetterConfig: {}, 
      Description: "", 
      Environment: {}, 
      FunctionArn: edgearn,
      FunctionName: "myFunctionLE", 
      Handler: "index.handler", 
      KMSKeyArn: "", 
      LastModified: "2016-11-21T19:49:20.006+0000", 
      MemorySize: 128, 
      Role: "arn:aws:iam::123456789012:role/lambda_basic_execution", 
      Runtime: "python2.7", 
      Timeout: 123, 
      Version: "2", 
      VpcConfig: {}
    }
  }
  lambdadb[`${masterarn.slice(0, -2)}`] = {
    tags: { Tags: {
      'foo': 'master-bar',
      'baz': 'master-quux'
    }}
  }
}

const lambdaApiCall = jest.fn((options, api, resource, response) => response)

const mockLambda = jest.fn(options => ({
  getFunctionConfiguration: ({FunctionName}) =>
    lambdaApiCall(options, 'getFunctionConfiguration', FunctionName, {
      promise: () => Promise.resolve(lambdadb[FunctionName].config)
    }),
  listTags: ({Resource}) =>
    lambdaApiCall(options, 'listTags', Resource, {
      promise: () => Promise.resolve(lambdadb[Resource].tags)
    })
}))

jest.mock(
  'aws-sdk/clients/lambda',
  () => mockLambda,
  {virtual: true}
)

afterEach(() => {
  lambdaApiCall.mock.calls.forEach(c => !c[2].startsWith('arn') ||
    expect(c[2].split(':')[3]).toEqual(c[0].region))
  jest.clearAllMocks()
  resetdb()
})

describe('getTagsFor/lambda', () => {

  test('is a function', () => {
    expect(typeof getTags).toBe('function')
  })

  test('handles empty tag set', async () => {
    lambdadb[lambdaarn].tags.Tags = {}
    const tags = await getTags(lambdaarn)
    expect(Object.entries(tags).length).toBe(0)
  })

  test('handles missing tag set', async () => {
    delete lambdadb[lambdaarn].tags.Tags
    const tags = await getTags(lambdaarn)
    expect(Object.entries(tags).length).toBe(0)
  })

  test('returns mocked tags for $LATEST lambda', async () => {
    const tags = await getTags(lambdaarn)
    expect(Object.entries(tags).length).toBe(2)
    expect(tags).toEqual({
      "foo": "bar",
      "baz": "quux"
    })
  })

  test('returns mocked tags for versioned lambda', async () => {
    const tags = await getTags(masterarn)
    expect(Object.entries(tags).length).toBe(2)
    expect(tags).toEqual({
      "foo": "master-bar",
      "baz": "master-quux"
    })
  })

  test('returns mocked tags for edge lambda', async () => {
    const tags = await getTags(edgearn)
    expect(Object.entries(tags).length).toBe(2)
    expect(tags).toEqual({
      "foo": "master-bar",
      "baz": "master-quux"
    })
  })

})


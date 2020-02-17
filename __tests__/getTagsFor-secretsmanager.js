
import getTags from '../getTagsFor'

// example data from https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#describeSecret-property
const testarn = "arn:aws:secretsmanager:us-west-2:123456789012:secret:MyTestDatabaseSecret-a1b2c3"
const secretdb = {}
function resetdb() {
  secretdb[testarn] = {
    ARN: "arn:aws:secretsmanager:us-west-2:123456789012:secret:MyTestDatabaseSecret-a1b2c3", 
    Description: "My test database secret", 
    KmsKeyId: "arn:aws:kms:us-west-2:123456789012:key/EXAMPLE1-90ab-cdef-fedc-ba987KMSKEY1", 
    LastAccessedDate: new Date(),
    LastChangedDate: new Date(),
    LastRotatedDate: new Date(),
    Name: "MyTestDatabaseSecret", 
    RotationEnabled: true, 
    RotationLambdaARN: "arn:aws:lambda:us-west-2:123456789012:function:MyTestRotationLambda", 
    RotationRules: {
     AutomaticallyAfterDays: 30
    }, 
    Tags: [
       {
      Key: "SecondTag", 
      Value: "AnotherValue"
     }, 
       {
      Key: "FirstTag", 
      Value: "SomeValue"
     }
    ], 
    VersionIdsToStages: {
     "EXAMPLE1-90ab-cdef-fedc-ba987EXAMPLE": [
         "AWSPREVIOUS"
      ], 
     "EXAMPLE2-90ab-cdef-fedc-ba987EXAMPLE": [
         "AWSCURRENT"
      ]
    }
  }
}

const mockSecretsManager = jest.fn(options => ({
  describeSecret: ({SecretId}) => ({
    promise: () => Promise.resolve(secretdb[SecretId])
  })
}))

jest.mock(
  'aws-sdk/clients/secretsmanager',
  () => mockSecretsManager,
  {virtual: true}
)

beforeEach(() => {
  jest.clearAllMocks()
  resetdb()
})

describe('getTagsFor/secretsmanager', () => {

  test('is a function', () => {
    expect(typeof getTags).toBe('function')
  })

  test('handles empty tag list', async () => {
    secretdb[testarn].Tags = []
    const tags = await getTags(testarn)
    expect(Object.entries(tags).length).toBe(0)
  })

  test('handles missing tag list', async () => {
    delete secretdb[testarn].Tags
    const tags = await getTags(testarn)
    expect(Object.entries(tags).length).toBe(0)
  })

  test('returns mocked tags', async () => {
    const tags = await getTags(testarn)
    expect(Object.entries(tags).length).toBe(2)
    expect(tags).toEqual({
      "SecondTag": "AnotherValue",
      "FirstTag": "SomeValue"
    })
  })

})


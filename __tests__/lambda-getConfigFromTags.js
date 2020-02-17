
import getConfigFromTags from '../lambda/getConfigFromTags'

var tagdb = {}
const mockGetTags = jest.fn(arn => Promise.resolve(tagdb[arn]))

jest.mock(
  '../getTagsFor/lambda',
  () => arn => mockGetTags(arn),
  {virtual: true}
)

beforeEach(() => {
  jest.clearAllMocks()
  tagdb = {}
})

describe('lambda/getConfigFromTags', () => {

  test('is a function', () => {
    expect(typeof getConfigFromTags).toBe('function')
  })

  test('handles no tags', async () => {
    const arn = 'arn:aws:lambda:us-west-2:123456789012:function:myFunction'
    tagdb[arn] = {}
    const config = await getConfigFromTags({
      arn,
      prefix: '',
      sep: '.',
      retryFirstDelay: 500,
      retryMaxDelay: 120000
    })
    // make sure it's using our mocked getTags
    expect(mockGetTags.mock.calls.length).toBe(1)
    expect(Object.entries(config).length).toBe(0)
  })

  test('parses tags into config object', async () => {
    const arn = 'arn:aws:lambda:us-west-2:123456789012:function:myFunction:2'
    tagdb[arn] = {
      'SOME_OTHER_TAG': 'other value',
      'config.foo': 'foo',
      'config.bar': 'bar',
      'config.baz.quux': 'quux'
    }
    const config = await getConfigFromTags({
      arn,
      prefix: 'config.',
      sep: '.',
      retryFirstDelay: 500,
      retryMaxDelay: 120000
    })
    expect(config).toEqual({
      'foo': 'foo',
      'bar': 'bar',
      'baz': {
         'quux': 'quux'
       }
    })
  })

})


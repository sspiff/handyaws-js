
import parseArn from '../parseArn'
import getKeyValue from '../keyValue/get'

const TESTTAGS = {
  'test-1': {
    'test-resource': {
      'foo': 'foo',
      'bar': 'bar'
    }
  }
}

const mockTags = jest.fn(arn => {
  const a = parseArn(arn)
  return Promise.resolve(TESTTAGS[a.region][a.resource])
})

jest.mock(
  '../getTagsFor/test',
  () => ({
    __esModule: true,
    default: mockTags
  }),
  {virtual: true}
)

describe('keyValue/tag-get', () => {

  test('invokes getTagsFor', async () => {
    const region = 'test-1'
    const rsrc = 'test-resource'
    const tagname = 'bar'
    const u = `tag:///arn:aws:test:${region}:1234567890:${rsrc}#${tagname}`
    const v = await getKeyValue(u)
    expect(v).toBe(TESTTAGS[region][rsrc][tagname])
  })

})


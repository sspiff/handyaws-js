
import getTagsFor from '../getTagsFor'

const mockTags = jest.fn(arn => arn)

jest.mock(
  '../getTagsFor/test',
  () => ({
    __esModule: true,
    default: mockTags
  }),
  {virtual: true}
)

describe('getTagsFor', () => {

  test('is a function', () => {
    expect(typeof getTagsFor).toBe('function')
  })

  test('loads implementation based on arn', () => {
    const a = 'arn:PARTITION:test:REGION:ACCOUNTID:RESOURCEID'
    expect(getTagsFor(a)).toBe(a)
    expect(mockTags.mock.calls.length).toBe(1)
  })

})


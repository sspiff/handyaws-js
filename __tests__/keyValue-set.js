
import setKeyValue from '../keyValue/set'

const mockSet = jest.fn((uri, value) => Promise.resolve(value))

jest.mock(
  '../keyValue/test-set',
  () => ({
    __esModule: true,
    default: mockSet
  }),
  {virtual: true}
)

describe('keyValue/set', () => {

  test('is a function', () => {
    expect(typeof setKeyValue).toBe('function')
  })

  test('loads implementation based on uri', async () => {
    const u = 'test://foo'
    const v = 'bar'
    await expect(setKeyValue(u, v)).resolves.toBe(v)
    expect(mockSet.mock.calls.length).toBe(1)
    expect(mockSet.mock.calls[0][0]).toBe(u)
    expect(mockSet.mock.calls[0][1]).toBe(v)
  })

})


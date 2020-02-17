
import getKeyValue from '../keyValue/get'

const mockGet = jest.fn(uri => Promise.resolve(uri))

jest.mock(
  '../keyValue/test-get',
  () => ({
    __esModule: true,
    default: mockGet
  }),
  {virtual: true}
)

describe('keyValue/get', () => {

  test('is a function', () => {
    expect(typeof getKeyValue).toBe('function')
  })

  test('loads implementation based on uri', async () => {
    const u = 'test://foo'
    await expect(getKeyValue(u)).resolves.toBe(u)
    expect(mockGet.mock.calls.length).toBe(1)
    expect(mockGet.mock.calls[0][0]).toBe(u)
  })

})


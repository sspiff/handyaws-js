
import setKeyValue from '../keyValue/set'

const mockPutParameter = jest.fn(params => {
    const p = Promise.resolve({})
    return { promise: () => p }
  })

const mockSSM = jest.fn(options => ({
  putParameter: mockPutParameter
}))

jest.mock(
  'aws-sdk/clients/ssm',
  () => mockSSM,
  {virtual: true}
)

describe('keyValue/ssm-set', () => {

  test('invokes ssm putParameter', async () => {
    const p = { region: 'test-1', name: '/bar/baz' }
    const u = `ssm://${p.region}${p.name}`
    const v = 'quux'
    await expect(setKeyValue(u, v)).resolves.toBe(v)
    expect(mockSSM.mock.calls.length).toBe(1)
    expect(mockSSM.mock.calls[0][0].region).toBe(p.region)
    expect(mockPutParameter.mock.calls.length).toBe(1)
    expect(mockPutParameter.mock.calls[0][0].Name).toBe(p.name)
    expect(mockPutParameter.mock.calls[0][0].Value).toBe(v)
  })

})


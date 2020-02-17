
import getKeyValue from '../keyValue/get'

const mockSSM = jest.fn(options => ({
  getParameter: params => {
    const p = Promise.resolve({
        Parameter: {
          Value: JSON.stringify({region: options.region, name: params.Name})
        }
      })
    return { promise: () => p }
  }
}))

jest.mock(
  'aws-sdk/clients/ssm',
  () => mockSSM,
  {virtual: true}
)

describe('keyValue/ssm-get', () => {

  test('invokes ssm getParameter', async () => {
    const p = {region: 'test-1', name: '/test/parameter'}
    const u = `ssm://${p.region}${p.name}`
    const r = JSON.parse(await getKeyValue(u))
    expect(r.region).toBe(p.region)
    expect(r.name).toBe(p.name)
  })

})


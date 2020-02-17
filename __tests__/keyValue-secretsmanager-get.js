
import parseArn from '../parseArn'
import getKeyValue from '../keyValue/get'

const TESTSECRETS = {
  'test-1': {
    'testapp/secret': 'supersecret'
  }
}

const mockGetSecret = jest.fn((region, params) => {
    var secretid = params.SecretId
    if (secretid.startsWith('arn:'))
      secretid = parseArn(secretid).resource.slice(7)
    const p = Promise.resolve({
        SecretString: TESTSECRETS[region][secretid]
      })
    return { promise: () => p }
  })

const mockSM = jest.fn(options => ({
  getSecretValue: params => mockGetSecret(options.region, params)
}))

jest.mock(
  'aws-sdk/clients/secretsmanager',
  () => mockSM,
  {virtual: true}
)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('keyValue/secretsmanager-get', () => {

  test('invokes secretsmanager getSecretValue (friendly name)', async () => {
    const p = { region: 'test-1', name: 'testapp/secret' }
    const u = `secretsmanager://${p.region}/${p.name}`
    const v = await getKeyValue(u)
    expect(mockSM.mock.calls.length).toBe(1)
    expect(mockSM.mock.calls[0][0].region).toBe(p.region)
    expect(mockGetSecret.mock.calls.length).toBe(1)
    expect(mockGetSecret.mock.calls[0][0]).toBe(p.region)
    expect(mockGetSecret.mock.calls[0][1].SecretId).toBe(p.name)
    expect(v).toBe(TESTSECRETS[p.region][p.name])
  })

  test('invokes secretsmanager getSecretValue (arn)', async () => {
    const p = { region: 'test-1', name: 'testapp/secret' }
    const a = `arn:PARTITION:secretsmanager:${p.region}:01234567890:secret:${p.name}`
    const u = `secretsmanager:///${a}`
    const v = await getKeyValue(u)
    expect(mockSM.mock.calls.length).toBe(0)  // cached!
    expect(mockGetSecret.mock.calls.length).toBe(1)
    expect(mockGetSecret.mock.calls[0][0]).toBe(p.region)
    expect(mockGetSecret.mock.calls[0][1].SecretId).toBe(a)
    expect(v).toBe(TESTSECRETS[p.region][p.name])
  })

})


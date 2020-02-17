
import _awsClient from '../client'

const mockTestConstructor = jest.fn(options => ({
  id: options.id
}))

jest.mock(
  'aws-sdk/clients/test',
  () => mockTestConstructor,
  {virtual: true}
)

// we don't have a way to clear the client cache, so instead we
// branch each client with a test cycle number that is incremented
// before each test:
var cycle = 0
const awsClient = (service, options={}) =>
  _awsClient(service, {...options, cycle})

beforeEach(() => {
  jest.clearAllMocks()
  cycle += 1
})

describe('client', () => {

  test('is a function', () => {
    expect(typeof _awsClient).toBe('function')
  })

  test('loads service from aws-sdk/clients/', () => {
    expect(awsClient('test', {id: 1}).id).toBe(1)
  })

  test('caches clients', () => {
    const test = awsClient('test', {id: 1})
    expect(test.id).toBe(1)
    expect(mockTestConstructor.mock.calls.length).toBe(1)
    const testagain = awsClient('test', {id: 1})
    expect(testagain).toBe(test)
    expect(mockTestConstructor.mock.calls.length).toBe(1)
  })

  test('creates different clients for different options', () => {
    const test = awsClient('test', {id: 1})
    expect(test.id).toBe(1)
    expect(mockTestConstructor.mock.calls.length).toBe(1)
    const testagain = awsClient('test', {id: 1})
    expect(testagain).toBe(test)
    expect(mockTestConstructor.mock.calls.length).toBe(1)
    const test2 = awsClient('test', {id: 2})
    expect(test2.id).toBe(2)
    expect(test.id).toBe(1)
    expect(test).not.toBe(test2)
    expect(mockTestConstructor.mock.calls.length).toBe(2)
  })

})


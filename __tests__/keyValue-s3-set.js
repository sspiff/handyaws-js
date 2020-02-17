
import setKeyValue from '../keyValue/set'

const mockPutObject = jest.fn(params => {
    const p = Promise.resolve({})
    return { promise: () => p }
  })

const mockS3 = jest.fn(options => ({
  putObject: mockPutObject
}))

jest.mock(
  'aws-sdk/clients/s3',
  () => mockS3,
  {virtual: true}
)

describe('keyValue/s3-set', () => {

  test('invokes s3 putObject', async () => {
    const p = { Bucket: 'foo', Key: '/bar/baz' }
    const u = `s3://${p.Bucket}${p.Key}`
    const v = 'quux'
    await expect(setKeyValue(u, v)).resolves.toBe(v)
    expect(mockPutObject.mock.calls.length).toBe(1)
    expect(mockPutObject.mock.calls[0][0].Bucket).toBe(p.Bucket)
    expect(mockPutObject.mock.calls[0][0].Key).toBe(p.Key)
    expect(mockPutObject.mock.calls[0][0].Body).toBe(v)
  })

})


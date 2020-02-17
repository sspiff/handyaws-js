
import getKeyValue from '../keyValue/get'

const mockS3 = jest.fn(options => ({
  getObject: params => {
    const p = Promise.resolve({
        Body: Buffer.from(JSON.stringify(params))
      })
    return { promise: () => p }
  }
}))

jest.mock(
  'aws-sdk/clients/s3',
  () => mockS3,
  {virtual: true}
)

describe('keyValue/s3-get', () => {

  test('invokes s3 getObject', async () => {
    const p = { Bucket: 'foo', Key: '/bar/baz' }
    const u = `s3://${p.Bucket}${p.Key}`
    const r = JSON.parse(await getKeyValue(u))
    expect(r.Bucket).toBe(p.Bucket)
    expect(r.Key).toBe(p.Key)
  })

})


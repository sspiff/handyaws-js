
import parseArn from '../parseArn'

describe('parseArn', () => {

  test('is a function', () => {
    expect(typeof parseArn).toBe('function')
  })

  test('parses an arn', () => {
    const a = 'arn:PARTITION:SERVICE:REGION:ACCOUNTID:RESOURCEID'
    expect(parseArn(a))
      .toEqual({
        partition: 'PARTITION',
        service: 'SERVICE',
        region: 'REGION',
        accountid: 'ACCOUNTID',
        resource: 'RESOURCEID',
      })
  })

  test('parses an arn with resource type (format 1)', () => {
    const a = 'arn:PARTITION:SERVICE:REGION:ACCOUNTID:RESOURCETYPE:RESOURCEID'
    expect(parseArn(a))
      .toEqual({
        partition: 'PARTITION',
        service: 'SERVICE',
        region: 'REGION',
        accountid: 'ACCOUNTID',
        resource: 'RESOURCETYPE:RESOURCEID',
      })
  })

  test('parses an arn with resource type (format 2)', () => {
    const a = 'arn:PARTITION:SERVICE:REGION:ACCOUNTID:RESOURCETYPE/RESOURCEID'
    expect(parseArn(a))
      .toEqual({
        partition: 'PARTITION',
        service: 'SERVICE',
        region: 'REGION',
        accountid: 'ACCOUNTID',
        resource: 'RESOURCETYPE/RESOURCEID',
      })
  })

})


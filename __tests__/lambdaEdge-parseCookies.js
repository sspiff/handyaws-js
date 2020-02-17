
import parseCookies from '../lambdaEdge/parseCookies'


var event
function resetEvent() {
  // from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
  event = {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionDomainName": "d123.cloudfront.net",
          "distributionId": "EDFDVBD6EXAMPLE",
          "eventType": "viewer-request",
          "requestId": "MRVMF7KydIvxMWfJIglgwHQwZsbG2IhRJ07sn9AkKUFSHS9EXAMPLE=="
        },
        "request": {
          "body": {
            "action": "read-only",
            "data": "eyJ1c2VybmFtZSI6IkxhbWJkYUBFZGdlIiwiY29tbWVudCI6IlRoaXMgaXMgcmVxdWVzdCBib2R5In0=",
            "encoding": "base64",
            "inputTruncated": false
          },
          "clientIp": "2001:0db8:85a3:0:0:8a2e:0370:7334",
          "querystring": "size=large",
          "uri": "/picture.jpg",
          "method": "GET",
          "headers": {
            "host": [
              {
                "key": "Host",
                "value": "d111111abcdef8.cloudfront.net"
              }
            ],
            "user-agent": [
              {
                "key": "User-Agent",
                "value": "curl/7.51.0"
              }
            ]
          },
          "origin": {
            "custom": {
              "customHeaders": {
                "my-origin-custom-header": [
                  {
                    "key": "My-Origin-Custom-Header",
                    "value": "Test"
                  }
                ]
              },
              "domainName": "example.com",
              "keepaliveTimeout": 5,
              "path": "/custom_path",
              "port": 443,
              "protocol": "https",
              "readTimeout": 5,
              "sslProtocols": [
                "TLSv1",
                "TLSv1.1"
              ]
            },
            "s3": {
              "authMethod": "origin-access-identity",
              "customHeaders": {
                "my-origin-custom-header": [
                  {
                    "key": "My-Origin-Custom-Header",
                    "value": "Test"
                  }
                ]
              },
              "domainName": "my-bucket.s3.amazonaws.com",
              "path": "/s3_path",
              "region": "us-east-1"
            }
          }
        }
      }
    }
  ]
  }
}

beforeEach(() => {
  resetEvent()
})


describe('lambdaEdge/parseCookies', () => {

  test('is a function', () => {
    expect(typeof parseCookies).toBe('function')
  })

  test('parses cookies', () => {
    // cookie structure from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-general-examples
    const requestCookies = [
      {key: 'Cookie', value: 'First=1; Second=2'},
      {key: 'Cookie', value: 'ClientCode=abc'}
    ]
    event.Records[0].cf.request.headers.cookie = requestCookies
    const c = parseCookies(event.Records[0].cf.request.headers)
    expect(Object.keys(c).length).toBe(3)
    expect(c).toEqual({
      'First': '1',
      'Second': '2',
      'ClientCode': 'abc'
    })
  })

  test('handles no cookies', () => {
    const c = parseCookies(event.Records[0].cf.request.headers)
    expect(Object.keys(c).length).toBe(0)
    expect(c).toEqual({})
  })

  test('handles no headers', () => {
    const c = parseCookies(undefined)
    expect(Object.keys(c).length).toBe(0)
    expect(c).toEqual({})
  })

  test('ignores extra ;', () => {
    // from https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie#Examples
    const requestCookies = [
      {key: 'Cookie', value: 'PHPSESSID=298zf09hf012fh2; csrftoken=u32t4o3tb3gg43; _gat=1;'},
    ]
    event.Records[0].cf.request.headers.cookie = requestCookies
    const c = parseCookies(event.Records[0].cf.request.headers)
    expect(Object.keys(c).length).toBe(3)
    expect(c).toEqual({
      'PHPSESSID': '298zf09hf012fh2',
      'csrftoken': 'u32t4o3tb3gg43',
      '_gat': '1'
    })
  })

})


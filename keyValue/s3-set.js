
import client from '../client'


export default (uri, value) =>
  (({hostname, pathname}) =>
    client('s3').putObject({
      Bucket: hostname,
      Key: pathname,
      Body: value
    }).promise().then(() => value)
  )(new URL(uri))


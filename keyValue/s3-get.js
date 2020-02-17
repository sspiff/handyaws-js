
import client from '../client'


export default uri =>
  (({hostname, pathname}) =>
    client('s3').getObject({Bucket: hostname, Key: pathname}).promise()
      .then(data => data.Body.toString())
  )(new URL(uri))


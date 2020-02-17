
import client from '../client'


export default (uri, value) =>
  (({hostname, pathname}) =>
    client('ssm', {region: hostname})
      .putParameter({Name: pathname, Type: 'String', Value: value}).promise()
      .then(() => value)
  )(new URL(uri))


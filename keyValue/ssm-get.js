
import client from '../client'


export default uri =>
  (({hostname, pathname}) =>
    client('ssm', {region: hostname})
      .getParameter({Name: pathname}).promise()
      .then(data => data.Parameter.Value)
  )(new URL(uri))


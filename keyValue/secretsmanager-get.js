
import client from '../client'
import parseArn from '../parseArn'


export default uri =>
  (({hostname, pathname}) => {
    pathname = pathname.slice(1)
    return client(
        'secretsmanager',
        {region: hostname ||
          (pathname.startsWith('arn:') && parseArn(pathname).region)}
      )
        .getSecretValue({SecretId: pathname}).promise()
        .then(data => data.SecretString)
  })(new URL(uri))


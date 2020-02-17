
import awsClient from '../client'
import parseArn from '../parseArn'

export default arn =>
  awsClient('secretsmanager', {region: parseArn(arn).region})
  .describeSecret({SecretId: arn}).promise()
  .then(data => data.Tags || [])
  .then(tagList => tagList.reduce((a, t) => ({...a, [t.Key]: t.Value}), {}))



import awsClient from '../client'
import parseArn from '../parseArn'


export default arn => {
  const L = awsClient('lambda', {region: parseArn(arn).region})
  return (
    // get the master arn, if any
    L.getFunctionConfiguration({FunctionName: arn}).promise()
    .then(data => data.MasterArn || arn)
    // remove any version number
    .then(arn => arn.split(':').slice(0, 7).join(':'))
    // finally get and return the tags
    .then(arn => L.listTags({Resource: arn}).promise())
    .then(data => data.Tags || {})
  )
}


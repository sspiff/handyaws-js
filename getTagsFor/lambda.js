
import awsClient from '../client'
import parseArn from '../parseArn'


export default arn =>
  awsClient('lambda', {region: parseArn(arn).region})
  // get the master arn, if any
  .getFunctionConfiguration({FunctionName: arn}).promise()
  .then(data => data.MasterArn || arn)
  // remove any version number
  .then(arn => arn.split(':').slice(0, 7).join(':'))
  // finally get and return the tags
  .then(arn =>
      // region of master arn may be different from that of original arn
      awsClient('lambda', {region: parseArn(arn).region})
      .listTags({Resource: arn}).promise()
    )
  .then(data => data.Tags || {})


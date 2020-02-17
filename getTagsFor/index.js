
import parseArn from '../parseArn'


/**
 * Gets the tags for the resource identified by `arn`.
 *
 * Returns a `Promise` that resolves to an `Object` that maps tag keys
 * to values for the tags on the resource identified by `arn`.
 *
 * Supports the following resources: Lambda functions,
 * Secrets Manager secrets.
 *
 * @function getTagsFor
 * @memberof module:@sspiff/handyaws
 * @param {string} arn - ARN of the resource for which to get tags
 * @returns {Promise}
 *
 * @example
 * <caption>Typical usage pattern:</caption>
 * import getTagsFor from '@sspiff/handyaws/getTagsFor'
 *
 * getTagsFor('arn:aws:lambda:us-west-2:123456789012:function:myFunction')
 *   .then(tags => ...)
 * // tags => {
 * //   'tag1': 'value1',
 * //   'tag2': 'value2'
 * //   ...
 * // }
 */
export default arn => require(`./${parseArn(arn).service}`).default(arn)


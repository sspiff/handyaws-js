
import {
  fromPairsDeep,
  lruMemoize,
  perishableRetryPromise,
  pipe
} from '@sspiff/handy'

import getTags from '../getTagsFor/lambda'

/**
 * Builds a configuration data object using data from tags on the
 * lambda function.  This can be useful for Lambda@Edge, where environment
 * variables cannot be used.
 *
 * Returns a `Promise` that resolves to an `Object` containing the
 * configuration data.
 *
 * @function lambda/getConfigFromTags
 * @memberof module:@sspiff/handyaws
 * @param {Object} params
 * @param {string} params.arn - ARN of lambda function
 * @param {string} params.prefix - Tag name filter
 * @param {string} params.sep - Structure separator
 * @param {number} params.maxAge - Milliseconds
 * @param {number} params.retryFirstDelay - Milliseconds
 * @param {number} params.retryMaxDelay - Milliseconds
 * @returns {Promise} Resolves to an `Object`
 *
 * @example
 * <caption>Typical usage pattern:</caption>
 * import getConfigFromTags from '@sspiff/handyaws/lambda/getConfigFromTags'
 *
 * function lambda_handler(event, context, callback) {
 *   getConfigFromTags({
 *     arn: context.invokedFunctionArn,
 *     prefix: 'config.',
 *     sep: '.',
 *     retryFirstDelay: 500,
 *     retryMaxDelay: 120000
 *   }).then(config => ...)
 * }
 */
export default pipe(
  lruMemoize(1, params =>
    perishableRetryPromise(params.retryFirstDelay, params.retryMaxDelay,
      p => getTags(params.arn).then(tags => {
        if (params.maxAge)
          p.expiresAt = Date.now() + params.maxAge
        return fromPairsDeep(Object.entries(tags), params.sep, params.prefix)
      })
    )
  ),
  p => p()
)


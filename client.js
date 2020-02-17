
import memoize from 'fast-memoize'

/**
 * Returns an AWS service client object.
 *
 * The returned client object will have been created for the given `service`
 * with the given `options`.  `client()` is a memoized function, so the
 * returned object may be from the cache.
 *
 * The service client constructor is loaded using
 * ``require(`aws-sdk/clients/${service}`)``, and the given `options` are
 * passed to the constructor unmodified.
 *
 * Cached objects are unique across both the `service` and the content of
 * `options`, so multiple client objects for the same service will exist if
 * they were created with different options.
 *
 * @function client
 * @memberof module:@sspiff/handyaws
 * @param {string} service - The name of the service for which to create a
 *   client.
 * @param {Object} [options] - Options to pass to the service client
 *   constructor.
 * @returns {Object}
 *
 * @example
 * <caption>Typical usage pattern:</caption>
 * import awsClient from '@sspiff/handyaws/client'
 *
 * const S3 = awsClient('s3')
 * S3.getObject(...).promise().then(...)
 *
 * const LAMBDA = awsClient('lambda', {region: 'us-east-1'})
 * LAMBDA.getFunctionConfiguration(...).promise().then(...)
 */
export default memoize((service, options) => {
  service = __non_webpack_require__(`aws-sdk/clients/${service}`)
  return new service(options)
})


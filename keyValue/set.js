
/**
 * Sets the value for a given key.
 *
 * AWS offers multiple resources that can conceptually be viewed as key/value
 * stores, such as systems manager's parameter store and S3.  `setKeyValue()`
 * provides a generic interface that sets a key/value based on a URI scheme.
 * This allows an application to easily support setting values in different
 *  AWS services based on a configurable URI string.
 * 
 * Returns a `Promise` that resolves to the value.
 *
 * Supports the following key/value sources:
 *
 * | AWS Resource | URI Format                      |
 * | ------------ | ------------------------------- |
 * | Parameter Store | `ssm://REGION/PARAMETERNAME` |
 * | S3              | `s3://BUCKET/KEY`            |
 *
 * #### Notes:
 *
 * - `setKeyValue()` is designed for simple string values.  It is not intended
 *   to be used with large or binary S3 objects, for example.
 * - See also {@link module:@sspiff/handyaws.keyValue/get getKeyValue()}.
 *
 * @function keyValue/set
 * @memberof module:@sspiff/handyaws
 * @param {string} uri - URI for the key
 * @param {string} value - Value to set
 * @returns {Promise} - Resolves to the key's value
 *
 * @example
 * <caption>Typical usage:</caption>
 * import setKeyValue from '@sspiff/handyaws/keyValue/set'
 *
 * setKeyValue('s3://my-bucket/foo/bar', 'newvalue').then(...)
 *
 * setKeyValue('ssm://us-east-1/foo/bar', 'newvalue').then(...)
 */
export default (uri, value) =>
  require(`./${(new URL(uri)).protocol.slice(0, -1)}-set`).default(uri, value)



/**
 * Gets the value for a given key.
 *
 * AWS offers multiple resources that can conceptually be viewed as key/value
 * stores, such as systems manager's parameter store, S3, and even resource
 * tags.  `getKeyValue()` provides a generic interface that selects a key/value
 * based on a URI scheme.  This allows an application to easily support
 * sourcing values from different AWS services based on a configurable
 * URI string.
 * 
 * Returns a `Promise` that resolves to the value for the given URI key.
 *
 * Supports the following key/value sources:
 *
 * | AWS Resource | URI Format                      |
 * | ------------ | ------------------------------- |
 * | Parameter Store | `ssm://REGION/PARAMETERNAME` |
 * | S3              | `s3://BUCKET/KEY`            |
 * | Secrets Manager | `secretsmanager://REGION/SECRETFRIENDLYNAME`<br>`secretsmanager:///SECRETARN` |
 * | Tags            | `tag:///ARN#TAGNAME`         |
 *
 * #### Notes:
 *
 * - `getKeyValue()` is designed for simple string values.  It is not intended
 *   to be used with large or binary S3 objects, for example.
 * - For the `tag:///` scheme, `getKeyValue()` supports the same resources
 *   supported by {@link module:@sspiff/handyaws.getTagsFor getTagsFor()}.
 * - See also {@link module:@sspiff/handyaws.keyValue/set setKeyValue()}.
 *
 * @function keyValue/get
 * @memberof module:@sspiff/handyaws
 * @param {string} uri - URI for the key
 * @returns {Promise} - Resolves to the key's value
 *
 * @example
 * <caption>Typical usage:</caption>
 * import getKeyValue from '@sspiff/handyaws/keyValue/get'
 *
 * getKeyValue('s3://my-bucket/foo/bar').then(value => ...)
 * // => yields the contents of 'foo/bar' from S3 bucket 'my-bucket'
 *
 * getKeyValue('ssm://us-east-1/foo/bar').then(value => ...)
 * // => yields the value of the parameter named 'foo/bar' from the
 * //    systems manager parameter store in the 'us-east-1' region
 */
export default uri =>
  require(`./${(new URL(uri)).protocol.slice(0, -1)}-get`).default(uri);


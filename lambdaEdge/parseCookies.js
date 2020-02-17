
/**
 * Parses cookie headers from lambda@edge request events.
 *
 * Given the `request.headers` object from the lambda@edge request event,
 * `parseCookies()` returns an object mapping cookie names to cookie values.
 *
 * @function lambdaEdge/parseCookies
 * @memberof module:@sspiff/handyaws
 * @param {Object} headers - `headers` object from the event `request`.
 * @returns {Object} A mapping of cookie names to cookie values.
 *
 * @example
 * <caption>Typical usage pattern:</caption>
 * import parseCookies from '@sspiff/handyaws/lambdaEdge/parseCookies'
 *
 * function lambda_handler(event, context, callback) {
 *   const request = event.Records[0].cf.request
 *   const cookies = parseCookies(request.headers)
 *   // => { COOKIE1NAME: COOKIE1VALUE, COOKIE2NAME: COOKIE2VALUE, ... }
 * }
 */
export default headers => (
  // extract the value from each header
  ((headers && headers.cookie) || []).map(c => c.value)
  // flatten the list 
  .join(';').split(';')
  // map each to pairs
  .map(c => c.split('=').map(s => s.trim()))
  // filter out empty keys
  .filter(([k, v]) => k !== '')
  // reduce to object
  .reduce((a, [k, v]) => ({...a, [k]: v}), {})
)



/**
 * Parse an ARN.
 *
 * Given an `arn` such as:
 *
 * <pre>
 * arn:<i>PARTITION</i>:<i>SERVICE</i>:<i>REGION</i>:<i>ACCOUNTID</i>:<i>RESOURCEID</i>
 * arn:<i>PARTITION</i>:<i>SERVICE</i>:<i>REGION</i>:<i>ACCOUNTID</i>:<i>RESOURCETYPE</i>:<i>RESOURCEID</i>
 * arn:<i>PARTITION</i>:<i>SERVICE</i>:<i>REGION</i>:<i>ACCOUNTID</i>:<i>RESOURCETYPE</i>/<i>RESOURCEID</i>
 * </pre>
 *
 * `parseArn()` returns an object with the following properties:
 *
 * | Property  | Value                         |
 * | --------- | ----------------------------- |
 * | partition | <code><i>PARTITION</i></code> |
 * | service   | <code><i>SERVICE</i></code>   |
 * | region    | <code><i>REGION</i></code>    |
 * | accountid | <code><i>ACCOUNTID</i></code> |
 * | resource  | <code><i>RESOURCEID</i></code><br><code><i>RESOURCETYPE</i>:<i>RESOURCEID</i></code><br><code><i>RESOURCETYPE</i>/<i>RESOURCEID</i></code>  |
 *
 * @function parseArn
 * @memberof module:@sspiff/handyaws
 * @param {string} arn - The ARN to parse
 * @returns {Object}
 */
export default arn => {
  const a = arn.split(':')
  return {
    partition: a[1],
    service:   a[2],
    region:    a[3],
    accountid: a[4],
    resource:  a.slice(5).join(':')
  }
}



import getTagsFor from '../getTagsFor'


export default uri =>
  (({pathname, hash}) =>
    getTagsFor(pathname.slice(1))
      .then(tags => tags[hash.slice(1)])
  )(new URL(uri))


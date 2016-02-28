export default function (fn) {
  return async function (done) {
    try {
      done(null, await fn.apply(this, arguments))
    } catch (err) {
      done(err)
    }
  }
}

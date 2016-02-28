export default (fn) => {
  return async function (done) {
    try {
      done(null, await fn())
    } catch (err) {
      done(err)
    }
  }
}

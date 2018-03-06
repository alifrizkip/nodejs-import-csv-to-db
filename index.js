const csv = require('csv')
const fs = require('fs')

exports.import = (file, options, knex, CustomPromise) => {
  const activePromises = []
  options.expectHeader = options.expectHeader || true
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(file) // input stream
    const ctx = {}
    const transformer = csv.transform(record => {
      if (options.expectHeader && !ctx.header) {
        ctx.header = record
        return
      }
      const row = {}
      record.map((i, idx) => {
        if (i) {
          row[ctx.header[idx]] = i
        }
      })
      const promise = knex(options.table).insert(row)
      activePromises.push(promise)
      promise
      .then(inserted => {
        activePromises.splice(activePromises.indexOf(promise), 1)
      })
      .catch(err => {
        options.logError ? options.logError(err) : console.log(err)
        activePromises.splice(activePromises.indexOf(promise), 1)
      })
    })
    transformer.on('finish', () => {
      function _wait () {
        if (activePromises.length === 0) {
          resolve()
        } else {
          setTimeout(_wait, 1000) // wait 1 sec
        }
      }
      _wait() // wait till all activePromises are empty
    })
    // pipe input -> csv parse -> transformer: to start the actual import
    input.pipe(csv.parse()).pipe(transformer)
  })
}

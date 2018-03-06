
// this construct record with attrs read from header row
// and stores them into given table
exports.defaultProcessRow = (knex, table) => (row, ctx) => {
  const rec = row.reduce((rec, i, idx) => {
    if (i) {
      rec[ctx.header[idx]] = i
    }
    return rec
  }, {})
  const promise = knex(table).insert(rec)
  return promise
}

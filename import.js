require('dotenv').config({path: process.env.DOTENV_FILE || '.env'})
const path = require('path')
const Knex = require('knex')
const CSVImport = require('./index')
const ROWProcessors = require('./row_processors')

const DBCONN = process.env.DATABASE_URL
const parts = DBCONN.split('://')
const knexConf = parts[0] === 'sqlite' ? {
  client: 'sqlite3',
  connection: {filename: parts[1]},
  useNullAsDefault: true,
  debug: true,
  pool: { min: 0, max: 7 }
} : {
  client: 'mysql',
  connection: DBCONN
}

const knex = Knex(knexConf)
const file = path.join(process.cwd(), 'example', 'exampledata.csv')
const options = {
  expectHeader: true
}
const processRow = ROWProcessors.defaultProcessRow(knex, 'employees')
CSVImport.import(file, processRow, options).then(() => {
  console.log('import done')
})

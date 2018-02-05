const csv = require('csvjson')
const knex = require('./knex')
const fs = require('fs')

const file = fs.readFileSync('data.csv', 'utf8')
const dataObj = csv.toObject(file)

knex.insert(dataObj)
    .into('employees')
    .then(() => {
        console.log('Import data done!')
        process.exit(0)
    })
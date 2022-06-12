const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const tableDta = new Schema({
    tableData: []
})
module.exports = mongoose.model('TableData' , tableDta)
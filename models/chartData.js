const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const chartData = new Schema({
    chartData: []
})
module.exports = mongoose.model('ChartData' , chartData)
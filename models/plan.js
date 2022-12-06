const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    name: String,
    description: String,
    location: String,
    stops: Array
});

module.exports = mongoose.model('Plan', PlanSchema);
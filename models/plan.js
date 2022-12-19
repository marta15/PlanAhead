const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const PlanSchema = new Schema({
    name: String,
    description: String,
    location: String,
    duration: Number,
    image: String,
    stops: Array
}, opts);

PlanSchema.virtual('country').get(function () {
    if (this.location.indexOf(',') != -1) {
        return this.location.slice(this.location.indexOf(',') + 2);
    }
    else return this.location;
});

module.exports = mongoose.model('Plan', PlanSchema);
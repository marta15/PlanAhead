const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };


const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', 'upload/w_300');
});

const PlanSchema = new Schema({
    name: String,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    duration: Number,
    image: ImageSchema,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    days: [{
        dayOfTheWeek: String,
        date: String,
        stops: [String]
    }]
}, opts);

PlanSchema.virtual('country').get(function () {
    if (this.location.indexOf(',') != -1) {
        return this.location.slice(this.location.indexOf(',') + 2);
    }
    else return this.location;
});
PlanSchema.virtual('properties.popUpMarkup').get(function () {
    return `
        <strong><a href='/plans/${this._id}'>${this.name}</a></strong>
        <p>${this.duration} days</p>`;
})

module.exports = mongoose.model('Plan', PlanSchema);
const ExpressError = require('../utils/ExpressError');
const Plan = require('../models/plan');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const ObjectId = require('mongoose').Types.ObjectId;
function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

module.exports.index = async (req, res) => {
    const { country } = req.query;
    if (country) {
        const plans = await Plan.find({ "location": { $regex: new RegExp(country, "i") } });
        let countryString = country.toString();
        res.render('plans/index', { plans, country: countryString.charAt(0).toUpperCase() + countryString.substring(1) });
    }
    else {
        const plans = await Plan.find({});
        res.render('plans/index', { plans, country: 'all countries' });
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render('plans/new');
};

module.exports.create = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.plan.location,
        limit: 1
    }).send();
    const plan = new Plan(req.body.plan);
    plan.geometry = geoData.body.features[0].geometry;
    if (req.file)
        plan.image = { url: req.file.path, filename: req.file.filename };
    else
        plan.image = { url: req.body.plan.imgUrl, filename: '' }
    plan.author = req.user._id;
    await plan.save();
    console.log(plan);
    req.flash('success', 'Successfully created a plan');
    res.redirect(`/plans/${plan._id}`)
};

module.exports.show = async (req, res) => {
    if (!isValidObjectId(req.params.id)) throw new ExpressError("Could not find plan", 400);
    const plan = await Plan.findById(req.params.id).populate('author');
    if (!plan) throw new ExpressError("Could not find plan", 400);
    res.render('plans/show', { plan });
};

module.exports.renderEditForm = async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        req.flash('error', 'Cannot find that plan');
        return res.redirect('/plans');
    }
    res.render('plans/edit', { plan });
};

module.exports.update = async (req, res) => {
    const { id } = req.params;
   
    const geoData = await geocoder.forwardGeocode({
        query: req.body.plan.location,
        limit: 1
    }).send();
    
    const plan = await Plan.findByIdAndUpdate(id, { ...req.body.plan });
    plan.geometry = geoData.body.features[0].geometry;
    if (req.file)
        plan.image = { url: req.file.path, filename: req.file.filename };
    else if (req.body.plan.imgUrl)
        plan.image = { url: req.body.plan.imgUrl, filename: '' };
    await plan.save();
    req.flash('success', 'Successfully updated plan');
    res.redirect(`/plans/${plan._id}`);
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findByIdAndDelete(id);
    if (plan.image.filename.length > 0)
        await cloudinary.uploader.destroy(plan.image.filename);
    req.flash('success', 'Successfully deleted plan');
    res.redirect('/plans');
};


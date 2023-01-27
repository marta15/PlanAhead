const ExpressError = require('../utils/ExpressError');
const Plan = require('../models/plan');

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
    const plan = new Plan(req.body.plan);
    plan.author = req.user._id;
    await plan.save();
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
    const p = await Plan.findByIdAndUpdate(id, { ...req.body.plan });
    req.flash('success', 'Successfully updated plan');
    res.redirect(`/plans/${p._id}`);
};

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted plan');
    res.redirect('/plans');
};


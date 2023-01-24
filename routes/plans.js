const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Plan = require('../models/plan');
const { isLoggedIn, isAuthor, validatePlan } = require('../middleware');

const ObjectId = require('mongoose').Types.ObjectId;

function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

router.get('/', wrapAsync(async (req, res) => {
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
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('plans/new');
});

router.post('/', isLoggedIn, validatePlan, wrapAsync(async (req, res, next) => {
    const plan = new Plan(req.body.plan);
    plan.author = req.user._id;
    await plan.save();
    req.flash('success', 'Successfully created a plan');
    res.redirect(`/plans/${plan._id}`)

}));

router.get('/:id', wrapAsync(async (req, res) => {
    if (!isValidObjectId(req.params.id)) throw new ExpressError("Could not find plan", 400);
    const plan = await Plan.findById(req.params.id).populate('author');
    if (!plan) throw new ExpressError("Could not find plan", 400);
    res.render('plans/show', { plan });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        req.flash('error', 'Cannot find that plan');
        return res.redirect('/plans');
    }
    res.render('plans/edit', { plan });
}));

router.put('/:id', isLoggedIn, isAuthor, validatePlan, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const p = await Plan.findByIdAndUpdate(id, { ...req.body.plan });
    req.flash('success', 'Successfully updated plan');
    res.redirect(`/plans/${p._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted plan');
    res.redirect('/plans');
}));

module.exports = router;
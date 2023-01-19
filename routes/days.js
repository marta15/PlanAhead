const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Plan = require('../models/plan');
const { daySchema } = require('../schemas');

const validateDay = (req, res, next) => {
    const { error } = daySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.post('/', validateDay, wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    const day = req.body.day;
    plan.days.push(day);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

router.delete('/:dayId', wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    plan.days.splice(req.params.dayId, 1);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

module.exports = router;


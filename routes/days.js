const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync');
const Plan = require('../models/plan');
const { validateDay, isLoggedIn, isAuthor } = require('../middleware');


router.post('/', isLoggedIn, isAuthor, validateDay, wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    const day = req.body.day;
    plan.days.push(day);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

router.post('/:dayId/stops', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id, dayId } = req.params;
    const plan = await Plan.findById(id);
    const stop = req.body.stop;
    plan.days[dayId].stops.push(stop);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

router.delete('/:dayId/stops/:stopId', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id, dayId, stopId } = req.params;
    const plan = await Plan.findById(id);
    plan.days[dayId].stops.splice(stopId, 1);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

router.delete('/:dayId', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    plan.days.splice(req.params.dayId, 1);
    await plan.save();
    res.redirect(`/plans/${plan._id}/edit`);
}));

module.exports = router;


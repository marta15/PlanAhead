const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync');
const { validateDay, isLoggedIn, isAuthor } = require('../middleware');
const days = require('../controllers/days');

router.post('/', isLoggedIn, isAuthor, validateDay, wrapAsync(days.create));
router.delete('/:dayId', isLoggedIn, isAuthor, wrapAsync(days.delete));
router.post('/:dayId/stops', isLoggedIn, isAuthor, wrapAsync(days.createStop));
router.delete('/:dayId/stops/:stopId', isLoggedIn, isAuthor, wrapAsync(days.deleteStop));

module.exports = router;


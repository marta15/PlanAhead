const express = require('express');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAuthor, validatePlan } = require('../middleware');
const plans = require('../controllers/plans');

router.route('/')
    .get(wrapAsync(plans.index))
    .post(isLoggedIn, upload.single('image'), validatePlan, wrapAsync(plans.create));

router.get('/new', isLoggedIn, plans.renderNewForm);

router.route('/:id')
    .get(wrapAsync(plans.show))
    .put(isLoggedIn, isAuthor, upload.single('image'), validatePlan, wrapAsync(plans.update))
    .delete(isLoggedIn, isAuthor, wrapAsync(plans.delete));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(plans.renderEditForm));


module.exports = router;
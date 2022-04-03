const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/review');
const { validateReview, isLoggedin, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedin, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;
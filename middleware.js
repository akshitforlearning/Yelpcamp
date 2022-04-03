const { campgroundSchema , reviewSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedin = (req, res, next) => {
    // console.log(req.path , req.originalUrl);
    // If we want user to continue from the same page from where they originally wanted to visit but could not because they were not signed in    
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    // Check the error object or rewatch Joi validation video , campgroundSchema in schema.js file
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // Since error message details is in the form of array like objects , .join is for multiple messages
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const reviews = await Review.findById(reviewId);
    if (!reviews.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {

    // Check the error object or rewatch Joi validation video 
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // Since error message details is in the form of array like objects , .join is for multiple messages
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};
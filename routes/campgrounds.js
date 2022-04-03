const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campground');
const Campground = require('../models/campground');
const { isLoggedin, isAuthor, validateCampground } = require('../middleware');

// Automatically looks for the nodejs file
const { storage } = require('../cloudinary');

// To parse multipart/form-data for file uploads we use multer npm package
const multer = require('multer');

const upload = multer({ storage });

// Cahining the code router,route is an express function
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(campgrounds.createNewCampground))
    // .post(upload.single('image') , (req,res) => {
    //     // For single file upload we use upload.single
    //     console.log(req.body , req.file);
    //     res.send("It worked check the console");
    // })
    // .post(upload.array('image') , (req,res) => {
    //     // For multiple files upload we use upload.array
    //     console.log(req.body , req.files);
    //     res.send("It worked check the console");
    // })

// We are using isLoggedin here so that user is unable to send a request from postman or curl , etc.      
router.get('/new', isLoggedin, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router;
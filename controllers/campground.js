const Campground = require('../models/campground');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { cloudinary } = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeoCoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
}

module.exports.createNewCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data' , 400); 
    // .campground is because of name we set in new.ejs form
    const campgrounds = new Campground(req.body.campground);
    campgrounds.geometry = geoData.body.features[0].geometry;
    campgrounds.image = req.files.map((f) => ({url: f.path , filename: f.filename}));
    // To know which author created the campground
    campgrounds.author = req.user._id;
    await campgrounds.save();
    req.flash('success', 'New Campground Created Successfully');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.showCampground = async (req, res) => {
    // const campgrounds = await Campground.findById(req.params.id).populate('reviews').populate('author');
    // To set the author in the review schema
    const campgrounds = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campgrounds) {
        req.flash('error', 'Cannot find the requested campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { campgrounds });
}

module.exports.renderEditForm = async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
        req.flash('error', 'Cannot find the requested campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', { campgrounds });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map((f) => ({url: f.path , filename: f.filename}));
    campgrounds.image.push(...imgs);
    await campgrounds.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campgrounds.updateOne({$pull: { image: { filename: { $in: req.body.deleteImages } } }});
    }
    req.flash('success', 'Updation Successful');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted Successfully');
    res.redirect('/campgrounds');
}
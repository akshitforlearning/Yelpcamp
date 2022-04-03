const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected')
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // This author id belongs to username of akshitjain232
            author: '6245a8f5ade04f3e2f569134',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore id eligendi temporibus numquam tempora! Repudiandae esse, perspiciatis voluptate est minima accusantium delectus nulla, maxime non rerum repellendus modi, doloremque provident?',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/akshit22/image/upload/v1648979330/Yelpcamp/img1_jy5bpl.webp',
                    filename: 'Yelpcamp/li9nmrndqpnuqwcfufn7'
                },
                {
                    url: 'https://res.cloudinary.com/akshit22/image/upload/v1648979330/Yelpcamp/image2_yvuzye.avif',
                    filename: 'Yelpcamp/klbvw0sgxutfpzy2t9jn'
                },
                {
                    url: 'https://res.cloudinary.com/akshit22/image/upload/v1648979330/Yelpcamp/image3_gwrkpe.avif',
                    filename: 'Yelpcamp/um2zan48yapm3vkaekc5'
                },
                {
                    url: 'https://res.cloudinary.com/akshit22/image/upload/v1648979330/Yelpcamp/image4_pqbba3.avif',
                    filename: 'Yelpcamp/rrnj07ym1qlj4mgbmov9'
                }
            ]
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
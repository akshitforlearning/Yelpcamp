const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Automatically adds the username and password fields to our UserSchema without us having to explicitly define it
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , UserSchema);
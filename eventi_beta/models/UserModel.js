const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    id_google: {
        type: String
    },

    email: {
        type: String,
    },

    password: {
        type: String,
    }

});

module.exports = mongoose.model('UserSchema', UserSchema);
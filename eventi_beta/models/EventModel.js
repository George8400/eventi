const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    creationDate: {
        type: Date,
        default: Date.now()
    },

    categories: [
        {
            type: String,
            required: true
        }
    ],

});

module.exports = mongoose.model('EventSchema', EventSchema);
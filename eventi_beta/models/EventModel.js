const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserSchema'
    },

    title: {
        type: String,
        required: true
    },

    titleUtility: {
        type: String,
        required: true
    },

    image: {
        type: String
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

    citta: {
        type: String,
        required: true
    },

    cittaUtility: {
        type: String,
        required: true
    },

    provincia: {
        type: String,
        required: true
    },

    provinciaUtility: {
        type: String,
        required: true
    },

    indirizzo: {
        type: String,
        required: true
    },
    indirizzoMaps: {
        type: String,
        required: true
    },

    giorno_i: {
        type: String,
        required: true
    },
    mese_i: {
        type: String,
        required: true
    },
    anno_i: {
        type: String,
        required: true
    },
    ora_i: {
        type: String,
        required: true
    },

    dateUtility_i: {
        type: String,
        required: true
    },

    hoursUtility_i: {
        type: String
    },
    giorno_f: {
        type: String,
        required: true
    },
    mese_f: {
        type: String,
        required: true
    },
    anno_f: {
        type: String,
        required: true
    },
    ora_f: {
        type: String,
        required: true
    },

    dateUtility_f: {
        type: String,
        required: true
    },

    hoursUtility_f: {
        type: String
    },

    lat: {
        type: String,
    },
    
    lng: {
        type: String,
    },

    views: {
        type: Number,
        default: 0
    }


});

module.exports = mongoose.model('EventSchema', EventSchema);
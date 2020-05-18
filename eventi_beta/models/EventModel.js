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

    giorno: {
        type: String,
        required: true
    },
    mese: {
        type: String,
        required: true
    },
    anno: {
        type: String,
        required: true
    },
    ora: {
        type: String,
        required: true
    },

    dateUtility: {
        type: String,
        required: true
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
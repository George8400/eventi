const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categories: [
        {
            type: String,
            required: true
        }
    ],

});

module.exports = mongoose.model('CategorySchema', CategorySchema);
const mongoose = require('mongoose');

const defective = {
    name: String,
    date: Date,
}

module.exports = mongoose.model('Defective', defective);
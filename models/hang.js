const mongoose = require('mongoose');

const hang = {
    name: String,
    date: Date,
    reason: String,
    hanger: String,
}

module.exports = mongoose.model('Hang', hang);
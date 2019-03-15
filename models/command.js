const mongoose = require('mongoose');

const command = {
    text: String,
    date: Date,
}

module.exports = mongoose.model('Command', command);
const mongoose = require('mongoose');

const command = {
    text: String,
    user: String,
    date: Date,
}

module.exports = mongoose.model('Command', command);
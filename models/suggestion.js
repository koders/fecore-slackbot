const mongoose = require('mongoose');

const suggestion = {
    text: String,
    user: String,
    date: Date,
}

module.exports = mongoose.model('Suggestion', suggestion);
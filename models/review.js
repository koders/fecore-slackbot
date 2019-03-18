const mongoose = require('mongoose');

const review = {
    link: String,
    user: String,
    updated: { type: Date, default: Date.now() },
    comments: String,
    reviewers: { type: [String], default: [] },
}

module.exports = mongoose.model('Review', review);
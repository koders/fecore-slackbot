const mongoose = require('mongoose');

const miniGrooming = {
    date: Date, // date of next MG
    happenning: Boolean,
}

module.exports = mongoose.model('MiniGrooming', miniGrooming);
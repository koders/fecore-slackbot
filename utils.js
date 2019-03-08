const format = require('date-format')

const formatDateAndTime = (date) => {
    return format("dd.MM.yyyy hh:mm:ss", date);
}

module.exports = {
    formatDateAndTime,
}
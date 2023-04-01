const moment = require('moment')
const testval = (end) => {
    const today = moment().format('DD-MM-YY')
    const diff = moment(end).isAfter(today)
    return diff ? false : true
}

module.exports = testval
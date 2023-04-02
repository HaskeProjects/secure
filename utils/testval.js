const moment = require('moment')
const testval = (end) => {
    const today = moment().format('DD-MM-YYYY')
    const diff = moment(end, 'DD-MM-YYYY').isAfter(today)
    console.log(diff, end, today)
    return diff
}

module.exports = testval
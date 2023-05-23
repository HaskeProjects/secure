const moment = require('moment')
const testval = (end) => {
    const today = moment().format('DD-MM-YYYY HH:mm:ss')
    const diff2 = end > today
    return diff2
}
module.exports = testval

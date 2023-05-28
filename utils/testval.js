const moment = require('moment');

const testval = (end) => {
    const today = moment();
    const endTime = moment(end, 'DD-MM-YYYY HH:mm:ss');
    const diff2 = endTime.isAfter(today);
    return diff2;
};

module.exports = testval;


function isType(obj) {
    return toString.call(obj) == '[object Date]'
}

function diffInMins(startDate, endDate) {
    // This will give difference in milliseconds
    var difference = endDate.getTime() - startDate.getTime(); 
    var resultInMinutes = Math.round(difference / 60000);
    return resultInMinutes
}

function toPrettyDate(date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();
}

var utils = {};
utils.isType = isType
utils.diffInMins = diffInMins;
utils.moment = require('moment')
utils.toPrettyDate = toPrettyDate
utils.getDateWithoutTime = getDateWithoutTime
utils.getTimeAgoFromDateIso = getTimeAgoFromDateIso
module.exports = utils;
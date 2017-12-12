const striptags = require('striptags');

function isType(obj) {
  return toString.call(obj) == '[object String]'
}

//a function for checking if an value is a function
const contains = function(s, needle) {
	if(!s || !needle) return false;
	return s.indexOf(needle) != -1;
}

function nthIndex(str, pat, n){
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

//define string replace all method
const replaceAll = function(s, search, replacement) {
	if(!s) return s
	if(!s.replace) return s
    return s.replace(new RegExp(search, 'g'), replacement);
}

const forceSingleSpaces = (s) => {
	if(!s) return s
	if(!s.replace) return s
	return s.replace(/ +(?= )/g,'')
}

const reverse = function(s) {
	if(!s) return s
	return Array.prototype.map.call(s, function(x) {
	  return x;
	}).reverse().join(''); 
}

function isValidUrl(str) {
	if(!str) return false	
	var expressionHttp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
	var expressionHttps = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
	var regexHttp = new RegExp(expressionHttp);
	var regexHttps = new RegExp(expressionHttps);
	return regexHttp.test(str) || regexHttps.test(str)
}

function isValidEmail(email) {
	return email && email.trim().length > 4 && email.indexOf('@') > 0
}

function prepareHTTPUrlOrEmailAddress(url) {
	if(!url || !url.length) return url
	var newUrl = url.trim()
	if (newUrl.indexOf('@') > -1 && newUrl.indexOf('/') < 0) {
		newUrl = 'mailto:' + trimUrlNoProtocol(newUrl)
	} else {
		newUrl = prepareHTTPUrl(newUrl)
	}
	return newUrl
}

function prepareHTTPUrl(url) {
	if(!url || !url.length) return url
	var newUrl = 'http://' + trimUrlNoProtocol(url)
	return newUrl
}

function prepareHTTPSUrl(url) {
	if(!url || !url.length) return url
	var newUrl = 'https://' + trimUrlNoProtocol(url)
	return newUrl
}

function trimUrlNoProtocol(url) {
	if(!url) return url
	var trimmedUrl = (url.replace('https://', '').replace('http://', '').replace('mailto:', '')).trim()
	return removeTrailingSlashFromUrl(trimmedUrl)
}

function removeTrailingSlashFromUrl(url) {
	if(!url) return url
	return url.replace(/\/$/, "")
}

const letterToNumberMap = {
	a: '0',b: '1',c: '2',d: '3',e: '4',
	f: '5',g: '6',h: '7',i: '8',j: '9',k: '10',
	l: '11',m: '12',n: '13',o: '14',p: '15',
	q: '16',r: '17',s: '18',t: '19',u: '20',
	v: '21',w: '22',x: '23',y: '24',z: '25'
}

const digitToLetterMap = {
	0: 'a',1: 'b',2: 'c',3: 'd',4: 'e',
	5: 'f',6: 'g',7: 'h',8: 'i',9: 'j'
}

function withDigitsToLetters(s) {
	var newString
	s.split('').forEach((l) => {
		const ll = l.toLowerCase()
		if(digitToLetterMap[ll] != undefined) {
			newString += digitToLetterMap[ll]
		} else {
			newString += l
		}
	})
	newString = replaceAll(newString, 'undefined', '').trim()
	return newString
}

function withLettersToNumber(s) {
	var newString
	s.split('').forEach((l) => {
		const ll = l.toLowerCase()
		if(letterToNumberMap[ll]) {
			newString += letterToNumberMap[ll]
		} else {
			newString += l
		}
	})
	return newString
}

const isValidHex = function(str) {
	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(str)
}

const getBase64SizeKb = function(base64Url) {
    if (!base64Url) return
    return 2*Math.ceil(base64Url.length/3) / 1000
}

/**
 * Converts new lines (\n) in text to html <br>
 * We don't want o save html, so only use this when sending text to client
 * @param {*} str 
 * @param {*} isXhtml 
 */
function newLineToBr (str, isXhtml) {
	//  discuss at: http://locutus.io/php/nl2br/
	// original by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Philip Peterson
	// improved by: Onno Marsman (https://twitter.com/onnomarsman)
	// improved by: Atli Þór
	// improved by: Brett Zamir (http://brett-zamir.me)
	// improved by: Maximusya
	// bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
	// bugfixed by: Kevin van Zonneveld (http://kvz.io)
	// bugfixed by: Reynier de la Rosa (http://scriptinside.blogspot.com.es/)
	//    input by: Brett Zamir (http://brett-zamir.me)
	//   example 1: nl2br('Kevin\nvan\nZonneveld')
	//   returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
	//   example 2: nl2br("\nOne\nTwo\n\nThree\n", false)
	//   returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
	//   example 3: nl2br("\nOne\nTwo\n\nThree\n", true)
	//   returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
	//   example 4: nl2br(null)
	//   returns 4: ''
	// Some latest browsers when str is null return and unexpected null value
	if (typeof str === 'undefined' || str === null) {
	  return ''
	}
	// Adjust comment to avoid issue on locutus.io display
	var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br ' + '/>' : '<br>'
	return (str + '')
	  .replace(/(\r\n|\n\r|\r|\n)/g, breakTag + '$1')
  }

function stripHtmlTags(html, allowedTags, tagReplacement) {
	if (!html) return
	allowedTags = tagReplacement || []
	tagReplacement = tagReplacement || ' '
	return striptags(html, allowedTags, tagReplacement);
}

function escapeHtml (string) {
	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	});
}

var utils = {};
utils.isType = isType
utils.contains = contains
utils.nthIndex = nthIndex
utils.replaceAll = replaceAll
utils.isValidUrl = isValidUrl
utils.withDigitsToLetters = withDigitsToLetters
utils.withLettersToNumber = withLettersToNumber
utils.prepareHTTPUrl = prepareHTTPUrl
utils.prepareHTTPSUrl = prepareHTTPSUrl
utils.prepareHTTPUrlOrEmailAddress = prepareHTTPUrlOrEmailAddress
utils.removeTrailingSlashFromUrl = removeTrailingSlashFromUrl
utils.isValidHex = isValidHex
utils.isValidEmail = isValidEmail
utils.getBase64SizeKb = getBase64SizeKb
utils.newLineToBr = newLineToBr
utils.stripHtmlTags = stripHtmlTags
utils.forceSingleSpaces = forceSingleSpaces
utils.escapeHtml = escapeHtml
module.exports = utils;
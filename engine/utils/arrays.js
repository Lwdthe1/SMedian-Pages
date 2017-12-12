'use strict';

//a function for checking if an value is a function
function isFunc(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//a function for checking if an value is a function
const isArray = function(objToCheck) {
	return objToCheck && Object.prototype.toString.call( objToCheck ) === '[object Array]';
}

const isEmptyArray = function (arr) {
	if(!isArray(arr)) return true
	return arr.length < 1
}

//copies elements of array2 into array1 without creating new array
const mergeInPlace = function(array1, array2) {
		Array.prototype.push.apply(array1, array2);
}

const clone = function(array) {
	if(!isArray(array)) return
	return array.slice(0);
}

const includes = function(array, searchElement) {
	if(!isArray(array)) return false;

	var O = Object(array);
	var len = parseInt(O.length) || 0;
	if (len === 0) {
	  return false;
	}
	var n = parseInt(arguments[1]) || 0;
	var k;
	if (n >= 0) {
	  k = n;
	} else {
	  k = len + n;
	  if (k < 0) {k = 0;}
	}
	var currentElement;
	while (k < len) {
	  currentElement = O[k];
	  if (searchElement === currentElement 
	  	|| (searchElement !== searchElement 
	    	&& currentElement !== currentElement)) { // NaN !== NaN
	    return true;
	  }
	  k++;
	}
	return false;
}

const isObject = function (objToCheck) {
	return objToCheck  
	&& Object.prototype.toString.call(objToCheck) === '[object Object]';
}

const pluckField = function (object, field) {
	if (isObject(object)) return object[field]
}

const pluckFields = function (objects, field) {
	if(!isArray(objects)) return []

	const values = []
	forEachCachedLength(objects, (object) => {
		if (isObject(object)) {
			values.push(object[field] || null)
		}
	})
	return values
}

const forEach = function(array, callback) {
	if(!isArray(array)) return false;
	if(!isFunc(callback)) throw new Error("forEach() requires callback function.")
	for(var i = 0; i < array.length; i++) {
		(function(i) {
			callback(array[i])
		}(i))
	}
}

const forEachCachedLength = function(array, callback) {
	if(!isArray(array)) return false;
	if(!isFunc(callback)) throw new Error("forEach() requires callback function.")
	for (var i = 0, len = array.length; i < len; i++) {
		(function(i) {
			callback(array[i])
		}(i))
	}
}

const removeElementAtArrayIndex = function(array, index) {
	if (index > -1 && !isEmptyArray(array)) {
		var element = array[index]
    array.splice(index, 1);
		return element
	}
}


function filterUniqueBy(a, cond) {
	return a.filter((e, i) => a.findIndex(e2 => cond(e, e2)) === i);
}

function filterUniqueByField(a, field) {
	return filterUniqueBy(a, (o1, o2) => o1[field] === o2[field])
}

// Returns a csv from an array of objects with
// values separated by tabs and rows separated by newlines
function objectsToCSV(array) {
    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);

    // Build header
    var result = keys.join("\t") + "\n";

    // Add the rows
    array.forEach(function(obj){
        keys.forEach(function(k, ix){
            if (ix) result += "\t";
            result += obj[k];
        });
        result += "\n";
    });

    return result;
}

function groupBy(xs, key) {
return xs.reduce(function(rv, x) {
	(rv[x[key]] = rv[x[key]] || []).push(x);
	return rv;
}, {});
};

var utils = {};
utils.forEach = forEach
utils.forEachCachedLength = forEachCachedLength
utils.isArray = isArray;
utils.isType = isArray
utils.includes = includes
utils.clone = clone
utils.isEmptyArray = isEmptyArray
utils.mergeInPlace = mergeInPlace
utils.pluckField = pluckField
utils.pluckFields = pluckFields
utils.filterUniqueBy = filterUniqueBy
utils.filterUniqueByField = filterUniqueByField
utils.removeElementAtArrayIndex = removeElementAtArrayIndex
utils.objectsToCSV = objectsToCSV
utils.groupBy = groupBy

module.exports = utils;


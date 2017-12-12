//a function for checking if an value is a function
const isObject = function (objToCheck) {
	return objToCheck  
	&& Object.prototype.toString.call(objToCheck) === '[object Object]';
}
const isObj = isObject

const isError = function (errToCheck) {
	return errToCheck  
	&& Object.prototype.toString.call(errToCheck) === '[object Error]';
}
const isErrObj = isError

const isEmpty = function(obj) {
	if(!isObj(obj)) return true
	// because Object.keys(new Date()).length === 0;
	// we have to do some additional check
	return Object.keys(obj).length === 0 && obj.constructor === Object
}

const forEachOwnProp = function(obj, callback) {
	var index = 0
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			callback(key, obj[key], index++)
		}
	}
}

const clone = function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

var utils = {};
utils.isObj = isObj;
utils.isType = isObj
utils.isEmpty = isEmpty
utils.forEachOwnProp = forEachOwnProp
utils.clone = clone
utils.memorySizeOf = memorySizeOf

module.exports = utils;
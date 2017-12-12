//a function for checking if an value is a function
function isFunc(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

const isErr = function (objToCheck) {
	return objToCheck  
	&& Object.prototype.toString.call(objToCheck) === '[object Error]';
}

const getStack = function(err) {
	var stack = err.stack.replace(/^[^\(]+?[\n$]/gm, '')
		.replace(/^\s+at\s+/gm, '')
		.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
		.split('\n');
	return stack
}

const getCallerNameFromError = function(err) {
	if(!isErr(err)) return '--'

	var stack = getStack(err)
	var callerName = stack[1]
	if(callerName) {
		callerName = callerName.split(' ')[0]
	} else {
		callerName = "-system-"
	}
	return callerName
}

const getCalleeNameFromError = function(err) {
	if(!isErr(err)) return '--'

	var stack = getStack(err)
	var calleeName = stack[1]
	if(calleeName) {
		calleeName = calleeName.split(' ')[0]
	} else {
		calleeName = "-system-"
	}
	return calleeName
}

var utils = {};
utils.isFunc = isFunc;
utils.isType = isFunc;
utils.getCurrentFuncName = getCalleeNameFromError
utils.getCurrentFuncCallerFuncName = getCallerNameFromError

module.exports = utils;
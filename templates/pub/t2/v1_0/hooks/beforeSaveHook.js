"use strict";

try {
const Q = require('q');
const globals = require('../../../../../engine/globals')
const switchboard = require('../../../../../switchboard')
const promiseUtils = switchboard.require('util.promises')
const errors = switchboard.require('util.errors')


/**
 * This function should verify the data that is to be saved.
 * It must return a promise that resolves with the final data if you are satisfied with the data.
 * Throw an error or reject the promise with an error that's meaningful to your frontend if you don't like the the data
 * Your error must have a "status" field that indicates the HTTP error. This way, your frontend can handle it in predictable manner
 * @param {Object} data 
 * @required
 */
function beforeSave(data) {
    return promiseUtils.promise(() => {
        if (data.someInvalidValue) {
            throw errors.errorWithStatus('some error message', 400)
        }

        // modify the data if you'd like
        data.someOtherField = data.someField + ' this was modified by the server'
        return data 
    })
}

module.exports = beforeSave
}catch(err) {
    console.log(err.stack)
}
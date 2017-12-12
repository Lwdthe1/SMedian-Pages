"use strict";

const Q = require('q')

module.exports = {
    Q: Q,
    promise: (callback) => {
        return Q.Promise((resolve) => resolve()).then(callback)
    }
}
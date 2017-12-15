"use strict";

module.exports = {
    errorWithStatus: function(message, status, code) {
        const err = new Error(message)
        err.status = status
        err.code = code
        return err
    }
}
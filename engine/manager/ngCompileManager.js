"use strict";

const Q = require('q')
const NgNodeCompile = require('ng-node-compile')

class Manager {
    _ngEnviroment
    prepare() {
        if (this._ngEnviroment) return Q.resolve()
        return Q.Promise((resolve, reject) => {
            NgNodeCompile.prototype.onEnvReady(() => {
                this._ngEnviroment = new NgNodeCompile();
                this._ngEnviroment.onReady(resolve)
            })
        })
    }
    getEnvironment() {
        return this._ngEnviroment
    }
}

module.exports = new Manager()
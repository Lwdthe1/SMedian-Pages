"use strict";

const Q = require('q')
const NgNodeCompile = require('ng-node-compile')

class Manager {
    prepare() {
        if (this._ngEnviroment) return Q.resolve()
        return Q.Promise((resolve, reject) => {
            NgNodeCompile.prototype.onEnvReady(() => {
                this._ngEnviroment = new NgNodeCompile();
                this._ngEnviroment.onReady(resolve)
            })
        })
    }
    getEnv() {
        return this._ngEnviroment
    }
}

module.exports = new Manager()
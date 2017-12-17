"use strict";

const Q = require('q')

const globals = require('./globals')
const switchboard = require('../switchboard')
const deepFreeze = require('deep-freeze-strict')

/**
 * The engine for interacting with Smedian pages.
 * The engine is configurable but is a singleton
 */
class Engine {
    /**
     * 
     * @param {EngineConfig} config 
     */
    start(config) {
        if (!config instanceof switchboard.require('config.Engine')) throw new Error('Invalid config param. config must be instance of EngineConfig')
        // ensure none of the config values can be altered
        this._config = deepFreeze(_config)
        
        const switchboardPromise = switchboard.connectRedis(_config.redisUrl)
        return Q.all([
            switchboardPromise
        ])
    }

    getFeedCards() {
        switchboard.templatesManager.getFeedCards()
    }
}

module.exports = {
    engine: new Engine(),
    EngineConfig: switchboard.require('config.Engine'),
    RenderPageOpts: switchboard.require('config.RenderPageOpts'),
    templatesManager: switchboard.templatesManager,
    constants: globals.constants,
}
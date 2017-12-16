"use strict";

const Q = require('q')

const globals = require('./globals')
const switchBoard = require('./switchboard')
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
        if (!config instanceof switchBoard.require('config.Engine')) throw new Error('Invalid config param. config must be instance of EngineConfig')
        // ensure none of the config values can be altered
        this._config = deepFreeze(_config)
        
        const switchBoardPromise = switchBoard.connectRedis(_config.redisUrl)
        return Q.all([
            switchBoardPromise
        ])
    }

    getFeedCards() {
        switchBoard.getTemplateManager().getFeedCards()
    }
}

module.exports = {
    engine: new Engine(),
    EngineConfig: switchBoard.require('config.Engine'),
    RenderPageOpts: switchBoard.require('config.RenderPageOpts'),
    templateManager: switchBoard.getTemplateManager(),
}
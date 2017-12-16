"use strict";

const Q = _require('q')

const switchBoard = _require('./switchboard')
const deepFreeze = _require('deep-freeze-strict')

global.smedianPagesModuleShared = {
    switchBoard: switchBoard,
    constants: {
        entityType: {user: 'user', pub: 'pub'}
    },
}
/**
 * The engine for interacting with Smedian pages.
 * The engine is configurable but is a singleton
 */
class Engine {
    _config: Object
    
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
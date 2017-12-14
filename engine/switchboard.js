"use strict";

const fs = require('fs');
const Q = require('q');
const promiseUtils = require('./utils/promises')
const RedisManager = require('./cache/RedisManager')

var _jsonCache = {}
class SwitchBoard {
    constructor(name) {
        this.name = name;
        this._redisManager = new RedisManager()
    }

    connectToRedis(redisUrl) {
        return this._redisManager.connect(redisUrl)
    }

    fetchSync(fileId) {
        switch (fileId) {
            case 'templatesJson': return _fetchFileSync(fileId, './templates.json')
            case 'examplesTemplateJson': return _fetchFileSync(fileId, '../examples/template.json')
            case 'examplesVersionJson': return _fetchFileSync('../examples/version.json')
        }
    }

    require(fileId) {
        switch (fileId) {
            case 'config.Engine': return require('./config/EngineConfig')
            case 'util.promises': return require('./utils/promises')
            case 'util.strings': return require('./utils/promises')
            case 'util.numbers': return require('./utils/promises')
            case 'util.arrays': return require('./utils/promises')
            case 'util.objects': return require('./utils/promises')
            case 'util.functions': return require('./utils/promises')
            case 'util.dates': return require('./utils/promises')
            case 'manager.redis': return require('./cache/RedisManager')
            
            default: throw new Error(`Unsupported fileId: ${fileId}`)
        }
    }

    /**
     * Fetches a file by its unique id
     * @private
     * @param {string} id A unique id for the file being fetched
     * @param {string} path The path to the file
     * @param {string} encoding The encoding to fetch the file in
     */
    _fetchFileSync(id, path, encoding) {
        if (!_jsonCache[id]) {
            _jsonCache[id] = fs.readFileSync(path, encoding || 'utf8')
        }
        return 
    }
}

const switchBoard = new SwitchBoard()
module.exports = switchBoard
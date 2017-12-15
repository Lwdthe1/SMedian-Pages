"use strict";

const fs = require('fs');
const Q = require('q');
const promiseUtils = require('./utils/promises')
const stringUtils = require('./utils/strings')
const RedisManager = require('./cache/RedisManager')
const Template = require('./classes/Template')

var _jsonCache = {}
class SwitchBoard {
    constructor(name) {
        this.name = name;
        this._redisManager = new RedisManager()
        this._fileCache = {}
    }

    connectToRedis(redisUrl) {
        return this._redisManager.connect(redisUrl)
    }

    fetchFileSyncById(fileId) {
        switch (fileId) {
            case 'templatesJson': return this.fetchFileSync('./templates.json')
            case 'examplesTemplateJson': return this.fetchFileSync('../examples/template.json')
            case 'examplesVersionJson': return this.fetchFileSync('../examples/version.json')
        }
    }

    requireTemplate(entityType, id) {
        return new Template(entityType, id)
    }

    require(fileId) {
        switch (fileId) {
            case 'config.RenderPageOpts': return require('./config/RenderPageOpts')
            case 'config.Engine': return require('./config/EngineConfig')
            case 'util.promises': return require('./utils/promises')
            case 'util.errors': return require('./utils/errors')
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
    fetchFileSync(path, encoding) {
        if (!this._fileCache[path]) {
            this._fileCache[path] = fs.readFileSync(path, encoding || 'utf8')
        }
        return 
    }
}

const switchBoard = new SwitchBoard()
module.exports = switchBoard
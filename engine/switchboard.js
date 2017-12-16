"use strict";

const fs = require('fs');
const Q = require('q');
const promiseUtils = require('./utils/promises')
const stringUtils = require('./utils/strings')
const RedisManager = require('./cache/RedisManager')
const TemplatesManager = require('./manager/templatesManager')
const Template = require('./classes/Template')

class SwitchBoard {
    constructor(name) {
        this.name = name;
        this._redisManager = new RedisManager()
        this._fileCache = {}
        this._templatesManager = new TemplatesManager()
    }

    connectToRedis(redisUrl) {
        return this._redisManager.connect(redisUrl)
    }

    getTemplateManager() {
        return this._templatesManager
    }

    require(fileId) {
        switch (fileId) {
            case 'manager.templates': require('./manager/templatesManager')
            case 'class.Template': require('./classes/Template')
            case 'class.TemplateVersion': require('./classes/TemplateVersion')
            case 'class.TemplateFeedCard': require('./classes/TemplateFeedCard')
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

    fetchFileSyncById(fileId) {
        switch (fileId) {
            case 'package.templates': return this.fetchFileSync('./templates.json')
            case 'examples.package.template': return this.fetchFileSync('../examples/template.json')
            case 'examples.package.version': return this.fetchFileSync('../examples/version.json')
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
        return this._fileCache[path]
    }

    fetchFileSyncFromRoot(path, encoding) {
        return this.fetchFileSync(`../${path}`, encoding)
    }
}

const switchBoard = new SwitchBoard()
module.exports = switchBoard
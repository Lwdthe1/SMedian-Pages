"use strict";

const fs = require('fs');
const Q = require('q');

const globals = require('./engine/globals')
const promiseUtils = require('./engine/utils/promises')
const stringUtils = require('./engine/utils/strings')

class SwitchBoard {
    constructor() {
        this._fileCache = {}
    }

    connectToRedis(redisUrl) {
        return this._redisManager.connect(redisUrl)
    }

    get _redisManager() {
        let RedisManager = require('./engine/cache/RedisManager')
        if (!this._redisManager) {
            this._redisManager = new RedisManager()
        }
        return this._redisManager
    }

    get templatesManager() {
        if (!this._templatesManager) {
            this._templatesManager = require('./engine/manager/templatesManager')
        }
        return this._templatesManager
    }

    require(fileId) {
        switch (fileId) {
            case 'manager.templates': return require('./engine/manager/templatesManager')
            case 'manager.NgCompile': return require('./engine/manager/ngCompileManager')
            case 'class.Template': return require('./engine/classes/Template')
            case 'class.TemplateVersion': return require('./engine/classes/TemplateVersion')
            case 'class.TemplateFeedCard': return require('./engine/classes/TemplateFeedCard')
            case 'config.RenderPageOpts': return require('./engine/config/RenderPageOpts')
            case 'config.Engine': return require('./engine/config/EngineConfig')
            case 'util.promises': return require('./engine/utils/promises')
            case 'util.errors': return require('./engine/utils/errors')
            case 'util.strings': return require('./engine/utils/promises')
            case 'util.numbers': return require('./engine/utils/promises')
            case 'util.arrays': return require('./engine/utils/promises')
            case 'util.objects': return require('./engine/utils/promises')
            case 'util.functions': return require('./engine/utils/promises')
            case 'util.dates': return require('./engine/utils/promises')
            case 'manager.redis': return require('./engine/cache/RedisManager')
            default: throw new Error(`Unsupported fileId: ${fileId}`)
        }
    }

    requireFromAbsolutePath(path) {
        return require(absolutePathFromRoot(path))
    }

    fetchFileSyncById(fileId) {
        switch (fileId) {
            case 'package.templates': return this.fetchEngineFileSync('templates.json')
            case 'examples.package.template': return this.fetchFileSync('examples/template.json')
            case 'examples.package.version': return this.fetchFileSync('examples/version.json')
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
            this._fileCache[path] = fs.readFileSync(absolutePathFromRoot(path), encoding || 'utf8')
        }
        return this._fileCache[path]
    }

    /**
     * Fetches a file by its unique id
     * @private
     * @param {string} id A unique id for the file being fetched
     * @param {string} path The path to the file
     * @param {string} encoding The encoding to fetch the file in
     */
    fetchEngineFileSync(path, encoding) {
        if (!this._fileCache[path]) {
            this._fileCache[path] = fs.readFileSync(pathFromEngine(path), encoding || 'utf8')
        }
        return this._fileCache[path]
    }

    static pathFromEngine(path) {
        return pathFromEngine(path)
    }

    static absolutePathFromRoot(path) {
        return absolutePathFromRoot(path)
    }
}

module.exports = new SwitchBoard()

function pathFromEngine (path) {
    return __dirname + '/engine/' + path
}
function absolutePathFromRoot(absolutePath) {
    return __dirname + absolutePath
}
"use strict";

const globals = require('../globals')
const switchboard = require('../switchboard')
const promiseUtils = switchboard.require('util.promises')
const errors = switchboard.require('util.errors')

class TemplateVersion {
    constructor(template, absolutePath) {
        this._template = template
        this._versionNumber = versionNumber
        this._version = JSON.parse(switchboard.fetchFileSync(absolutePath))
    }

    /**
     * @required
     */
    getIndexHtml() {
        return switchboard.fetchFileSync(this._version.indexAbsolutePath)
    }

    /**
     * @required
     */
    getEditorIndexHtml() {
        return switchboard.fetchFileSync(this._version.editorIndexAbsolutePath)
    }

    /**
     * @required
     */
    getDemoIndexHtml() {
        return switchboard.fetchFileSync(this._version.demoIndexAbsolutePath)
    }
}
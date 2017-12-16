"use strict";

const switchBoard = smedianPagesModuleShared.switchBoard
const promiseUtils = switchBoard.require('util.promises')
const errors = switchBoard.require('util.errors')

class TemplateVersion {
    constructor(template, absolutePath) {
        this._template = template
        this._versionNumber = versionNumber
        this._version = JSON.parse(switchBoard.fetchFileSync(absolutePath))
    }

    /**
     * @required
     */
    getIndexHtml() {
        return switchBoard.fetchFileSync(this._version.indexAbsolutePath)
    }

    /**
     * @required
     */
    getEditorIndexHtml() {
        return switchBoard.fetchFileSync(this._version.editorIndexAbsolutePath)
    }

    /**
     * @required
     */
    getDemoIndexHtml() {
        return switchBoard.fetchFileSync(this._version.demoIndexAbsolutePath)
    }
}
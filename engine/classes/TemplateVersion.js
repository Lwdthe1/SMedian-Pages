"use strict";

const switchBoard = smedianPagesModuleShared.switchBoard
const promiseUtils = switchBoard.require('util.promises')
const errors = switchBoard.require('util.errors')

class TemplateVersion {
    constructor(template, versionNumber) {
        this._template = template
        this._versionNumber = versionNumber
        this._version = JSON.parse(switchBoard.fetchFileSync(template.getVersionAbsolutePath(versionNumber)))
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
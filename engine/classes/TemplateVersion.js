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

    /**
     * Use this function to process the data that is to be used to render the page from the template.
     * This must return a promise that resolves with an HTML string or fails with an error
     * @param {TemplateVersion} templateVersion
     * @param {Object} data 
     * @required
     */
    renderIndex(data) {
        return promiseUtils.promise(() => {
            // fetch the template 
            const template = this.getHomeHtml()

            // use the template data to render the template
            var html = template.replace('{{variable}}', data.variable)
            return html
        })
    }
}
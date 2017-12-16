"use strict";

const Q = require('q');
const globals = require('../../../../../engine/globals')
const switchBoard = require('../../../../../engine/switchBoard')
const promiseUtils = switchBoard.require('util.promises')
const errors = switchBoard.require('util.errors')

/**
 * Use this function to process the data that is to be used to render the page from the template.
 * This must return a promise that resolves with an HTML string or fails with an error
 * @param {TemplateVersion} templateVersion
 * @param {RenderPageOpts} opts 
 * @required
 */
function renderPage(pageOpts) {
    return promiseUtils.promise(() => {
        const data = pageOpts.templateData
        // fetch the template 
        const template = this.getHomeHtml()

        // use the template data to render the template
        var html = template.replace('{{variable}}', data.variable)
        return html
    })
}

module.exports = renderPage
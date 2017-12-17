"use strict";

const Q = require('q');
const globals = require('../../../../../engine/globals')
const switchboard = require('../../../../../switchboard')
const promiseUtils = switchboard.require('util.promises')
const errors = switchboard.require('util.errors')

/**
 * Use this function to process the data that is to be used to render the page from the template.
 * This must return a promise that resolves with an HTML string or fails with an error
 * @param {TemplateVersion} templateVersion
 * @param {RenderPageOpts} pageOpts 
 * @required
 */
function Renderer(templateVersion) {
    this.run = (pageOpts) => {
        return templateVersion.promiseEditorIndexHtml()
            .then((template) => {
                var html = '<html ng-app="angularApp" ng-controller="AppCtrl"><head>' + template
                html = html.replace('0/*<<|cdata|>>*/;', JSON.stringify(pageOpts.currentUserData))
                return html      
            })
    }
}

module.exports = Renderer
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
    var _ngEnv
    this.run = (pageOpts) => {
        return Q.all([templateVersion.promiseIndexHtml(), switchboard.promiseFile('/templates/user/t1/v1_0/page/views/home.html')])
            .spread((indexTemplateResult, homeTemplateResult) => {
                let template = indexTemplateResult
                let indexHomeTemplate = homeTemplateResult
                
                const ssrNgViewHTML = '<span id="ssr-view-rmwr" style="position:absolute; left:-50000px">' + indexHomeTemplate + '</span>'
                template = template.replace('<span id="ssr-view-rmwr"></span>', ssrNgViewHTML)
                template = template.replace('<span id="ssr-view-rmwr" class="ng-scope"></span>', ssrNgViewHTML)

                return _renderTemplateWithData(template, pageOpts.templateData)
            })
            .then((html) => {
                html = '<html ng-app="angularApp" ng-controller="AppCtrl"><head>' + html
                html = html.replace('0/*<<|cdata|>>*/;', JSON.stringify(pageOpts.currentUserData))
                return html
            })
    }

    function _renderTemplateWithData(template, templateData) {
        return _getNgEnv()
            .then((ngEnv) => {
                return ngEnv.$compile(template)(templateData)
            })
    }

    function _getNgEnv() {
        if (!_ngEnv) {
            _ngEnv = switchboard.require('manager.NgCompile')
        }
        return _ngEnv.prepare()
            .then(() => _ngEnv.getEnv())
    }
}

module.exports = Renderer
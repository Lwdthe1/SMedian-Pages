"use strict";

const globals = require('../globals')
const switchBoard = require('../switchBoard')
const sharedConstants = globals.constants
const Template = switchBoard.require('class.Template')
const TemplateFeedCard = switchBoard.require('class.TemplateFeedCard')

class TemplateManager {
    constructor() {
        this._templateCache = {}
    }

    getPackage() {
        if (!this._package) {
            this._package = JSON.parse(switchBoard.fetchFileSyncById('package.templates'))
        }
        return this._package
    }

    getFeedCards(cache) {
        const results = {
            users: this.getUserTemplates(!cache),
            pubs: this.getPubTemplates(!cache).map((template) => )
        }
        return feedCards
    }

    getTemplate(entityType, id, dontCache) {
        const key = `${entityType}_${id}`

        if (dontCache) {
            return this._templateCache[key] || new Template(entityType, id)
        }

        if (!this._templateCache[key]) {
            this._templateCache[key] = new Template(entityType, id)
        }
        return this._templateCache[key]
    }

    getUserTemplates(dontCache) {
        return this.getUserTemplateIds().map((templateId) => this.getUserTemplate(templateId, dontCache))
    }

    getPubTemplates(dontCache) {
        return this.getPubTemplateIds().map((templateId) => this.getPubTemplate(templateId, dontCache))
    }

    getUserTemplate(id, dontCache) {
        return this.getTemplate(sharedConstants.entityType.user, id, dontCache))
    }

    getPubTemplate(id, dontCache) {
        return this.getTemplate(sharedConstants.entityType.pub, id, dontCache))
    }

    getUserTemplateIds () {
        return Object.keys(this.getPackage().templates.user)
    }

    getPubTemplateIds () {
        return Object.keys(this.getPackage().templates.pub)
    }
}

module.exports = new TemplateManager()
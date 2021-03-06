"use strict";

const globals = require('../globals')
const switchboard = require('../../switchboard')
const sharedConstants = globals.constants
const promiseUtils = switchboard.require('util.promises')
const Template = require('../classes/Template')
const TemplateFeedCard = require('../classes/TemplateFeedCard')

class TemplateManager {
    constructor() {
        this._templateCache = {}
    }

    get package() {
        if (!this._package) {
            this._package = JSON.parse(switchboard.fetchFileSyncById('package.templates'))
        }
        return this._package
    }

    getFeedCards(cache) {
        return promiseUtils.promise(() => {
            return {
                users: this.getUserTemplates(!cache).map(template => template.getCardContent()),
                pubs:  this.getPubTemplates(!cache).map(template => template.getCardContent()),
            }
        })
    }

    getUserFeedCards(cache) {
        return promiseUtils.promise(() => {
            return this.getUserTemplates(!cache).map(template => template.getCardContent())
        })
    }

    getPubFeedCards(cache) {
        return promiseUtils.promise(() => {
            return this.getPubTemplates(!cache).map(template => template.getCardContent())
        })
    }

    getTemplate(entityType, id, dontCache) {
        const key = `${entityType}_${id}`
        const absolutePath = this.package.templates[entityType][id].absolutePath
        if (dontCache) {
            return this._templateCache[key] || new Template(entityType, id, absolutePath)
        }

        if (!this._templateCache[key]) {
            this._templateCache[key] = new Template(entityType, id, absolutePath)
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
        return this.getTemplate(sharedConstants.entityType.user, id, dontCache)
    }

    getPubTemplate(id, dontCache) {
        return this.getTemplate(sharedConstants.entityType.pub, id, dontCache)
    }

    getUserTemplateIds () {
        return Object.keys(this.package.templates.user)
    }

    getPubTemplateIds () {
        return Object.keys(this.package.templates.pub)
    }
}

module.exports = new TemplateManager()
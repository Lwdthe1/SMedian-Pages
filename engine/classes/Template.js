"use strict";

const globals = require('../globals')
const switchboard = require('../../switchboard')
const TemplateVersion = switchboard.require('class.TemplateVersion')
const TemplateFeedCard = switchboard.require('class.TemplateFeedCard')

class Template {
    constructor(entityType, id, absolutePath) {
        this._id = id
        this._entityType = entityType
        this._data = JSON.parse(switchboard.fetchFileSync(absolutePath))
        this._versionsMap = {}
    }

    get id() {
        return this._id
    }
    get entityType() {
        return this._entityType
    }
    get data() {
        return this._data
    }

    getVersionAbsolutePath(versionNumber) {
        return this._data.versions[versionNumber].absolutePath
    }

    hasVersion(versionNumber) {
        return !!this._data.versions[versionNumber]
    }

    getVersion(versionNumber) {
        if (!versionNumber) return
        if (!this._versionsMap[versionNumber]) {
            this._versionsMap[versionNumber] = new TemplateVersion(versionNumber, this.getVersionAbsolutePath(versionNumber))
        }
        return this._versionsMap[versionNumber]
    }

    getLatestVersion() {
        return this.getVersion(this.latestVersionNumber)
    }

    get latestVersionNumber() {
        if (!this._latestVersionNumber) {
            let latest
            Object.keys(this._data.versions).forEach(versionNumber => {
                if (!this._data.versions[versionNumber].isReleased) return
                let v = parseFloat(versionNumber)
                latest = latest && latest.value > v ? latest : {value: v, versionNumber: versionNumber}
            })
            this._latestVersionNumber = latest && latest.versionNumber
        }
        return this._latestVersionNumber
    }

    getCardContent() {
        const latestVersion = this.getLatestVersion()
        const card = new TemplateFeedCard(this, this.latestVersionNumber, latestVersion)
        return card
    }
}

module.exports = Template
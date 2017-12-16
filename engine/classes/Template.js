use strict;

const switchBoard = smedianPagesModuleShared.switchBoard
const TemplateVersion = switchBoard.require('class.TemplateVersion')
const TemplateFeedCard = switchBoard.require('class.TemplateFeedCard')

class Template {
    constructor(entityType, id) {
        this._id = id
        this._entityType = entityType
        this._data = JSON.parse(switchBoard.fetchFileSyncFromRoot(`/templates/${entityType}/${id}/template.json`))
        this._versionsMap = {}
    }

    getData() {
        return this._data
    }

    getVersionAbsolutePath(versionNumber) {
        return this._data.versions[versionNumber].absolutePath
    }

    getVersion(versionNumber) {
        if (!versionNumber) return
        if (!this._versionsMap[versionNumber]) {
            this._versionsMap[versionNumber] = new TemplateVersion(versionNumber, this.getVersionAbsolutePath(versionNumber))
        }
        return this._versionsMap[versionNumber]
    }

    getLatestVersion() {
        return this.getVersion(this._getLatestVersionNumber())
    }

    
    _getLatestVersionNumber() {
        if (this._latestVersionNumber) return this._latestVersionNumber

        let latest
        Object.keys(this._data.versions).forEach(versionNumber => {
            if (!this._data.versions[versionNumber].isReleased) return
            let v = parseFloat(versionNumber)
            latest = latest && latest > v ? latest : v
        })
        this._latestVersionNumber = latest
    }

    getCardContent() {
        const latestVersionNumber = this._getLatestVersionNumber()
        const latestVersion = this.getLatestVersion()
        return new TemplateFeedCard(this._data.id, this._data.entityType, latestVersionNumber, latestVersion)
    }
}
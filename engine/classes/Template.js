"use strict";

const switchBoard = smedianPagesModuleShared.switchBoard

class Template {
    constructor(entityType, id) {
        this._id = id
        this._entityType = entityType
        this._data = JSON.parse(switchBoard.fetchFileSync(`./templates/${entityType}/${id}/template.json`))
    }

    getData() {
        return this._data
    }

    getVersionAbsolutePath(versionNumber) {
        return this._data.versions[versionNumber]
    }

    getVersion(versionNumber) {
        if (!this._versionsMap[versionNumber]) {
            this._versionsMap[versionNumber] = new TemplateVersion(this, versionNumber)
        }
        return this._versionsMap[versionNumber]
    }
}
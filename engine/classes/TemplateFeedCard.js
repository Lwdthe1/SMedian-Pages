"use strict";

class TemplateFeedCard {
    constructor(id, entityType, latestVersionNumber, latestVersion) {
        this.id = id
        this.entityType = entityType
        this.latestVersionNumber = latestVersionNumber
        this.fullTitle = latestVersion.title
        this.fullDescription = latestVersion.description
        this.title = latestVersion.card.title
        this.description = latestVersion.card.description
        this.imageAbsolutePath = latestVersion.card.imageAbsolutePath
        this.editorIndexAbsolutePath = latestVersion.editorIndexAbsolutePath
        this.demoIndexAbsolutePath = latestVersion.demoIndexAbsolutePath
        this.keywords = latestVersion.keywords
        this.customizableUnits = latestVersion.customizableUnits
        this.customizationDifficulty = latestVersion.customizationDifficulty
        this.language = latestVersion.language
    }
}

module.exports = TemplateFeedCard
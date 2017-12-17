"use strict";

class TemplateFeedCard {
    constructor(template, latestVersionNumber, latestVersion) {
        this.id = template.id
        this.entityType = template.entityType
        this.developer = template.data.developer
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
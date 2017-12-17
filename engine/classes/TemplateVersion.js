"use strict";

const globals = require('../globals')
const switchboard = require('../../switchboard')
const promiseUtils = switchboard.require('util.promises')
const errors = switchboard.require('util.errors')

class TemplateVersion {
    constructor(versionNumber, absolutePath) {
        this._versionNumber = versionNumber
        this._package = JSON.parse(switchboard.fetchFileSync(absolutePath))

        this.title = this._package.title
        this.description = this._package.description
        this.customizableUnits = this._package.customizableUnits
        this.customizationDifficulty = this._package.customizationDifficulty
        this.language = this._package.language
        this.editorIndexAbsolutePath = this._package.editorIndexAbsolutePath
        this.demoIndexAbsolutePath = this._package.demoIndexAbsolutePath
        this.imageAbsolutePath = this._package.imageAbsolutePath
        this.keywords = this._package.keywords
    }
    
    getHookAbsolutePath(key) {
        return this._package.hooks[key]
    }

    getHook(key) {
        return switchboard.requireFromAbsolutePath(this.getHookAbsolutePath(key))
    }

    getBeforeSaveHook() {
        if (!this._beforeSaveHook) {
            const Hook = this.getHook('beforeSave')
            this._beforeSaveHook = new Hook(this)
        }
        
        return this._beforeSaveHook
    }

    getServerSideRenderIndexHook() {
        if (!this._serverSideRenderIndexHook) {
            const Hook = this.getHook('serverSideRenderIndex')
            this._serverSideRenderIndexHook = new Hook(this)
        }
        
        return this._serverSideRenderIndexHook
    }

    getServerSideRenderEditorIndexHook() {
        if (!this._serverSideRenderEditorIndexHook) {
            const Hook = this.getHook('serverSideRenderEditorIndex')
            this._serverSideRenderEditorIndexHook = new Hook(this)
        }
        
        return this._serverSideRenderEditorIndexHook
    }

    getServerSideRenderDemoIndexHook() {
        if (!this._serverSideRenderDemoIndexHook) {
            const Hook = this.getHook('serverSideRenderDemoIndex')
            this._serverSideRenderDemoIndexHook = new Hook(this)
        }
        
        return this._serverSideRenderDemoIndexHook
    }

    get card(){
        return this._package.card
    }

    /**
     * @required
     */
    getIndexHtml() {
        return switchboard.fetchFileSync(this._package.indexAbsolutePath)
    }

    /**
     * @required
     */
    getEditorIndexHtml() {
        return switchboard.fetchFileSync(this._package.editorIndexAbsolutePath)
    }

    /**
     * @required
     */
    getDemoIndexHtml() {
        return switchboard.fetchFileSync(this._package.demoIndexAbsolutePath)
    }
}

module.exports = TemplateVersion
/**
 * Controlled configuration map for the engine
 */
class RenderPageOpts {
    constructor(templateData, opts) {
        this.templateData = opts.templateData // @required the data to be used to render a page
        this.pid = opts.pid // @optional you can use this to decide which page to render
    }
}

module.exports = RenderPageOpts
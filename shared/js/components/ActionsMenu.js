SmedianPages.component.ActionsMenu = function(config) {
    if(!config) throw new Error('[SmedianPages.component.ActionsMenu] config data is required')

    const self = this

    this.toggleShow = config.toggleShow || function(show) {
        self.show = show != undefined ? show : !self.show
    }
}

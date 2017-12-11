const SMedianPageComponentActionsMenu = function(config) {
    if(!config) throw new Error('[SMedianPageComponentActionsMenu] config data is required')
    if(!config.angularScope) throw new Error('[SMedianPageComponentActionsMenu] angularScope is required')
    if(!config.angularScopeUIUpdator) throw new Error('[SMedianPageComponentActionsMenu] angularScopeUIUpdator is required')

    const self = this
    const $scope = config.angularScope
    const angularScopeUIUpdator = config.angularScopeUIUpdator

    this.toggleShow = config.toggleShow || function(show) {
        angularScopeUIUpdator(() => {
            self.show = show != undefined ? show : !self.show
        })
    }
}

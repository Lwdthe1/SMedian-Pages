SmedianPages.component.ActionsMenu = function(config) {
    if(!config) throw new Error('[SmedianPages.component.ActionsMenu] config data is required')
    if(!config.page) throw new Error('[SmedianPages.component.ActionsMenu] page is required')
    if(!config.getCurrentUser) throw new Error('[SmedianPages.component.ActionsMenu] getCurrentUser function is required')

    const self = this
    const page = config.page
    const _getCurrentUser = config.getCurrentUser

    var _openButtonSelector = '.js-SmedianPageComponentActionsMenu-openButton'
    var _closeButtonSelector = '.js-SmedianPageComponentActionsMenu-closeButton'

    this.toggleShow = function(show) {
        _toggleShow(show)
    }

    function _getEl() {
        return $('.js-SmedianPageComponentActionsMenu')
    }

    var _isShown = false
    function _toggleShow(show) {
        _isShown = show != undefined ? show : !_isShown
        if(_isShown) {
            _getEl().show()
        } else {
            _getEl().hide()
        }
    }

    function _attachActions() {
        // detach existing hooks
        $(_openButtonSelector).unbind()
        $(_closeButtonSelector).unbind()

        // attach hooks
        $(_openButtonSelector).click(() => {
            _toggleShow(true)
        })

        $(_closeButtonSelector).click(() => {
            _toggleShow()
        })
    }

    if (!config.awaitAttachActionsMesage) {
        _fetchAndAttachHtml()
    }

    function _fetchAndAttachHtml() {
        if (_getEl().length) {
            _attachActions()
            return
        }
        const iframeId = Date.now() + 'jfkhgd-dsfiuy897y9rihjwek-iframe'
        var iframe = document.createElement('iframe');
        iframe.style.display = "none";
        iframe.id = iframeId
        iframe.src = '/vendor_node/smedian-pages/shared/views/component/menu/actionsMenuComponent.html'
        iframe.onload = (result) => {
            $('body').append(document.getElementById(iframeId).contentWindow.document.body.innerHTML)
            setTimeout(() => {
                _attachActions()
            }, 1000)
        }
        document.body.appendChild(iframe);
    }
}

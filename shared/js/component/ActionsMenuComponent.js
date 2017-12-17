SmedianPages.component.ActionsMenu = function(config) {
    if(!config) throw new Error('[SmedianPages.component.ActionsMenu] config data is required')
    if(!config.page) throw new Error('[SmedianPages.component.ActionsMenu] page is required')

    const self = this
    const _page = config.page
    var _currentUser

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
                debugger
                $('.js-SmedianPageComponentActionsMenu-showOnlyAdmin').hide()
                _attachActions()
                _currentUser = SmedianPages.CurrentUser.get()

                if (_currentUser) {
                    $('.js-SmedianPageComponentActionsMenu-currentUserAvatarContainer').show()
                    $('.js-SmedianPageComponentActionsMenu-currentUserAvatar').attr('src', _currentUser.imageUrl)
                } else {
                    $('.js-SmedianPageComponentActionsMenu-nonCurrentUserAvatarContainer').show()
                }

                if (!_page.currentUserIsPageAdmin) {
                    $('.js-SmedianPageComponentActionsMenu-containerMyPagesLink').show()
                    $('.js-SmedianPageComponentActionsMenu-myPagesLink').attr('href', `/pages/user/${_currentUser.id}`)
                    if (_currentUser && _currentUser.homePageId) {
                        $('.js-SmedianPageComponentActionsMenu-myPagesLink').text('All My Pages')
                    } else {
                        $('.js-SmedianPageComponentActionsMenu-myPagesLink').text('Make Mine')
                    }
                }

                if(_page.currentUserIsPageAdmin) {
                    $('.js-SmedianPageComponentActionsMenu-showOnlyAdmin').show()
                    $('.js-SmedianPageComponentActionsMenu-adminEditPageLink').attr('href', `/page/${_page.id}/_/admin`)
                    $('.js-SmedianPageComponentActionsMenu-adminAllPagesLink').attr('href', `/pages/${_page.masterObjectType}/${_page.masterObjectId}`)
                } else {
                    $('.js-SmedianPageComponentActionsMenu-showOnlyAdmin').hide()
                }

                if (!_page.currentUserIsPageAdmin && _page.masterObjectType == 'user') {
                    $('.js-SmedianPageComponentActionsMenu-containerChatLink').show()
                    $('.js-SmedianPageComponentActionsMenu-chatLink').attr('href', `/chat/${_page.masterObject.chatInviteUrl}`)
                    $('.js-SmedianPageComponentActionsMenu-chatLink').text(`Chat With ${page.masterObject.name || page.masterObject.username}`)
                } else {
                    $('.js-SmedianPageComponentActionsMenu-containerChatLink').hide()
                }

                if (_page.masterObjectType == 'user') {
                    var el = $('.js-SmedianPageComponentActionsMenu-masterUserProfileLink')
                    el.attr('href', `/writer/${_page.masterObjectId}/profile`)
                    el.text(`${page.masterObject.name || page.masterObject.username} Profile`)
                    el.show()
                } else {
                    var el = $('.js-SmedianPageComponentActionsMenu-masterPubProfileLink')
                    el.attr('href', `/p/${_page.masterObjectId}?settings=1`)
                    el.text(`${page.masterObject.title} Dashboard`)
                    el.show()
                }
            }, 250)
        }
        document.body.appendChild(iframe);
    }
}

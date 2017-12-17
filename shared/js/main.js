const SmedianPages = function() {
    const self = this
    const _vars = {}
    const WINDOW_SIZE_LARGE = 3
    const WINDOW_SIZE_SMALL = 2
    const WINDOW_SIZE_XSMALL = 1

    _vars.window = {
        originalWidth: $(window).width(),
        originalHeight: $(window).height(),
    }
    
    if (_vars.window.originalWidth > 992) {
        _vars.window.originalSizeRange = WINDOW_SIZE_LARGE
    } else if (_vars.window.originalWidth <= 991) {
        _vars.window.originalSizeRange = WINDOW_SIZE_SMALL
    } else if (_vars.window.originalWidth <= 479) {
        _vars.window.originalSizeRange = WINDOW_SIZE_XSMALL
    }
}

SmedianPages.VALID_OBJECT_ID_REGEX = new RegExp('^[0-9a-fA-F]{24}$')
SmedianPages.VALID_ACCESS_TOKEN_REGEX = new RegExp('^[0-9a-fA-F]{32}$')


SmedianPages.prototype.getSsrCData = () => {
    return SmedianPages.getSsrCData()
}

SmedianPages.prototype.getAndSetCurrentUserFromPage = () => {
    return SmedianPages.getAndSetCurrentUserFromPage()
}

SmedianPages.getSsrCData = () => {
    return __ssr__CData || {}
}

SmedianPages.getAndSetCurrentUserFromPage = () => {
    const currentUserFromServer = SmedianPages.getSsrCData().currentUser
    const currentUserAccessTokenFromServer = SmedianPages.getSsrCData().accessToken
    return SmedianPages.CurrentUser.set(currentUserAccessTokenFromServer, currentUserFromServer)
}



SmedianPages.service = function() {
    
}

SmedianPages.util = function() {

}

SmedianPages.component = function() {

}

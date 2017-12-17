/**
 * Created by lwdthe1 on 3/26/2016.
 */
(function(){
    var currentUser
    var session = {}
    SmedianPages.CurrentUser = function() {}
    SmedianPages.User = function(accessToken, scUser) {
        const isCurrentUser = currentUser && currentUser.id == scUser.id
        this.accessToken = accessToken
        this.id = scUser.id
        this.username = scUser.username
        this.url = scUser.url
        this.name = scUser.name
        this.bio = scUser.bio
        this.email = scUser.email
        this.imageUrl = scUser.imageUrl
        this.isWriter = scUser.isWriter
        this.numUnseenNotifications = scUser.numUnseenNotifications
        this.numContributeRequests = scUser.numContributeRequests
        this.mailchimpAccountId = scUser.mailchimpAccountId
        this.mailchimpAccountEmail = scUser.mailchimpAccountEmail
        this.homePageId = scUser.homePageId
        this.isUsingPageAsLandingPage = scUser.isUsingPageAsLandingPage || false
        this.chatInviteUrl = scUser.chatInviteUrl
        this._isSuperUser = scUser._isSuperUser

        this.hasValidEmail = this.email && this.email.length > 4 && this.email.indexOf('@') > 0 && this.email.indexOf('.') > 0
        this.hasValidMailchimpAccountEmail = this.mailchimpAccountEmail && this.mailchimpAccountEmail.length > 4 && this.mailchimpAccountEmail.indexOf('@') > 0 && this.mailchimpAccountEmail.indexOf('.') > 0
        try {
            this.id = (scUser.id || '').replace('"', '').replace('"', '')
        } catch(err) {
            this.id = scUser.id
        }
        this._allData = scUser
    }

    SmedianPages.CurrentUser.set = function (accessToken, dbUser) {
        if(!accessToken) return false
        if(!dbUser) return false
        currentUser = new SmedianPages.User(accessToken, dbUser)
        session = SmedianPages.getSsrCData().session
        return currentUser
    }

    SmedianPages.CurrentUser.get = function() {
        if(!currentUser) SmedianPages.getAndSetCurrentUserFromPage()
        return currentUser
    }

    SmedianPages.CurrentUser.idEquals = function(id) {
        return currentUser && currentUser.id + '' == id + ''
    }

    SmedianPages.CurrentUser.isSuperUser = () => {
        try {
        return currentUser._isSuperUser
        } catch(err) {}
    }

    SmedianPages.CurrentUser.getSession = () => {
        return session
    }

    SmedianPages.CurrentUser.getLastInitiatedOAuthType = () => {
        return session && session.lastInitiatedType
    }

    SmedianPages.CurrentUser.getPreAuthPath = () => {
        return session && session.preAuthRedirectToPath
    }

    SmedianPages.CurrentUser.hasValidEmail = () => {
        return currentUser.hasValidEmail
    }

    SmedianPages.CurrentUser.clearUnseenNotificationsCount = () => {
        delete currentUser.numUnseenNotifications
    }

    SmedianPages.CurrentUser.incrementNumContributeRequests = () => {
        if(currentUser) {
            currentUser.numContributeRequests += 1
        }
    }

    SmedianPages.User.getCurrent = SmedianPages.CurrentUser.get
}())

SmedianPages.User.prototype.getId = function() {
    return this.id;
};

SmedianPages.CurrentUser.getId = function() {
    const user = SmedianPages.CurrentUser.get()
    if(!user) return
    return user.getId()
}

SmedianPages.CurrentUser.getAccessToken = function() {
    const user = SmedianPages.CurrentUser.get()
    if(!user) return
    return user.getAccessToken()
}

SmedianPages.CurrentUser.hasValidCreds = function() {
    const user = SmedianPages.CurrentUser.get()
    if(!user) return false
    return SmedianPages.User.isValidId(user.getId()) && SmedianPages.User.isValidAccessToken(user.getAccessToken())
}

SmedianPages.User.isValidId = function (dbObjectId) {
    if(!dbObjectId) return false
    return SmedianPages.VALID_OBJECT_ID_REGEX.test(dbObjectId)
}

SmedianPages.User.isValidAccessToken = function (dbAccessToken) {
    if(!dbAccessToken) return false
    return SmedianPages.VALID_ACCESS_TOKEN_REGEX.test(dbAccessToken)
}

String.prototype.contains = function(it) { return this.indexOf(it) > -1}
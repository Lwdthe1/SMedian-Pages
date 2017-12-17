//manipulate the "editorsApp" module of our app
var angularApp = angular.module("angularApp", ['ngRoute', 'btford.socket-io']);

angularApp.run(function ($rootScope) {
    $rootScope.currentUser = SmedianPages.getAndSetCurrentUserFromPage()
});
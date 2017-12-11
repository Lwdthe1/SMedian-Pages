//manipulate the "editorsApp" module of our app
var angularApp = angular.module("angularApp", ['ngRoute', 'btford.socket-io']);

const mainApp = new MainApp()
angularApp.run(function ($rootScope) {
    $rootScope.currentUser = MainApp.getAndSetCurrentUserFromPage()
    mainApp.setAngularRootScope($rootScope)
});
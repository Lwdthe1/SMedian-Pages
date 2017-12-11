angularApp
    .config(['$routeProvider', '$locationProvider', function AppConfig($routeProvider, $locationProvider) {
        //the routeProvider module helps us configure routes in AngularJS.
        $routeProvider
            //when the user navigates to the root, index of our app
            .when("/", {
                templateUrl: "/api/e/web/html?path=pages/templates/pub/t2/page/views/home.html",
                controller: "HomeController"
            })
            //otherwise, default to sending them to the index page
            .otherwise({
                redirectTo: "/"
            });
    }])
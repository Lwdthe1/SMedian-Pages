angularApp
	.service("EmailService", function($http, $location) {
        this.submitPubNewsletterSignup = (pubId, email, name) => {
            NProgress.start()
            return $http.post("/api/e/stat/embed/pub/signup", { pubId: pubId, email: email, name: name })
                .then(function(response){
                    NProgress.done();
                    return response.data
                }, function(response){
                    NProgress.done()
                    return response
                });
        }
        
        this.submitUserNewsletterSignup = (userId, email, name) => {
            NProgress.start()
            return $http.post("/api/e/stat/embed/user/signup", { userId: userId, email: email, name: name })
                .then(function(response){
                    NProgress.done();
                    return response.data
                }, function(response){
                    NProgress.done()
                    return response
                });
        }
    })
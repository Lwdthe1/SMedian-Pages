angularApp
    /* An AngularJS service generates an object that can be used 
    by the rest of the application. Our service acts as the 
    client-side wrapper for all of our API endpoints.
    */
    //a service to run tasks for manipulating editors
    .service('Publications', function($http) {
        var functions = {};
        var apiRequestsPromisesCache = {}

        this.toggleRequestToContribute = function(pubId, status, data) {
            NProgress.start();
            var endpoint = '/api/i/pub/' + pubId + '/v/request/contribute/' + !!status

            return $http.post(endpoint, data)
                .then(function(response){
                    NProgress.done()
                    return response;
                }, function(response){
                    debugger
                    NProgress.done()
                    console.log('Error start new pub: ' + JSON.stringify(response));
                    return response.error
                });
        }

        this.sendContributeRequestSupportingLink = function(pubId, url) {
            NProgress.start();
            var endpoint = '/api/i/pub/' + pubId + '/v/request/contribute/support/link'

            return $http.post(endpoint, { url: url })
                .then(function(response){
                    NProgress.done()
                    return response.data;
                }, function(response){
                    NProgress.done()
                    console.log('Error start new pub: ' + JSON.stringify(response));
                    return response.error
                });
        }

        this.deleteContributeRequestSupportingLinkById = function(pubId, supportingLinkId) {
            NProgress.start();
            
            var endpoint = '/api/i/pub/' + pubId + '/v/request/contribute/support/link/' + supportingLinkId

            return $http.delete(endpoint)
                .then(function(response){
                    NProgress.done()
                    return response.data;
                }, function(response){
                    
                    NProgress.done()
                    console.log('Error start new pub: ' + JSON.stringify(response));
                    return response.error
                });
        }
    })
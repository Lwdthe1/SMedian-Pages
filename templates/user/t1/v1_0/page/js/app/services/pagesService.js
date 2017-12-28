angularApp
    /* An AngularJS service generates an object that can be used 
    by the rest of the application. Our service acts as the 
    client-side wrapper for all of our API endpoints.
    */
    //a service to run tasks for manipulating editors
    .service('PagesService', function($http) {
        var functions = {};
        var apiRequestsPromisesCache = {}

        this.create = function(masterObject, templateUniqueId) {
            if(!masterObject || !masterObject.id.length || !masterObject.type.length ) {
                return $.Deferred().reject(new Error("Invalid masterObject"))
            } else if( !templateUniqueId) {
                return $.Deferred().reject(new Error("Invalid templateUniqueId"))
            }

            NProgress.start();
            var endpoint = '/api/i/page/'+ masterObject.type + '/' + masterObject.id +'/create'
            endpoint += '?' + SERVER_API_KEY_PARAM
            
            //send REST request to our app to fetch all the editors
            return $http.post(endpoint, {
                templateUniqueId: templateUniqueId
            })
                .then(function(response){
                    NProgress.done()
                    return response.data;
                });
        }

        this.getTemplatesByMasterObjectType = function(masterObjectType) {
            NProgress.start();
            var endpoint = `/api/i/pages/feed/cards/${masterObjectType}`

            return $http.get(endpoint)
                .then(function(response) {
                    NProgress.done();
                    return response.data
                }, function(response) {
                    //action failed
                    NProgress.done();
                    return response
                });
        }

        this.loadByMasterObject = function(masterObject) {
            NProgress.start();
            var endpoint = '/api/i/page/' + masterObject.type + '/' + masterObject.id + '/v'
            endpoint += '?' + SERVER_API_KEY_PARAM

            return $http.get(endpoint)
                .then(function(response) {
                    NProgress.done();
                    return response.data
                }, function(response) {
                    //action failed
                    NProgress.done();
                    return response
                });
        }

        this.sendContactFormSubmission = function(pageId, submisison) {
            NProgress.start()
            var endpoint = '/api/i/page/' + pageId + '/v/contactForm/submission'
            endpoint += '?' + SERVER_API_KEY_PARAM
            return $http.post(endpoint, submisison)
                .then(function(response){
                    NProgress.done()
                    return response.data;
                });
        }

        this.toggleUsePageAsLandingPage = function(pageId, status) {
            NProgress.start();
            var endpoint = '/api/i/page/' + pageId + '/mod/toggleUserAsLandingPage/' + status
            
            //send REST request to our app to fetch all the editors
            return $http.put(endpoint)
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
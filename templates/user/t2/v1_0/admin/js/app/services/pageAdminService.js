angularApp
/* An AngularJS service generates an object that can be used 
by the rest of the application. Our service acts as the 
client-side wrapper for all of our API endpoints.
*/
//a service to run tasks for manipulating editors
.service('PageAdminService', function($http) {
    var functions = {};
    var apiRequestsPromisesCache = {}
    
    this.save = function(pageId, data) {
        NProgress.start();
        var endpoint = '/api/i/page/' + pageId + '/mod/draft'
        endpoint += '?' + SERVER_API_KEY_PARAM
        
        //send REST request to our app to fetch all the editors
        return $http.put(endpoint, data.draftData)
            .then(function(response){
                NProgress.done()
                return response.data;
            });
    }

    this.publish = function(pageId) {
        NProgress.start();
        var endpoint = '/api/i/page/' + pageId + '/mod/publish'
        endpoint += '?' + SERVER_API_KEY_PARAM
        
        //send REST request to our app to fetch all the editors
        return $http.put(endpoint)
            .then(function(response){
                NProgress.done()
                return response.data;
            });
    }

    this.getMediumtArticleData = function(url) {
        const endpoint = '/api/e/service/medium/articleJson?url=' + url
        const cacheKey = 'GET:' + endpoint
        NProgress.start();
        if(apiRequestsPromisesCache[cacheKey]) {
            NProgress.done();
            return apiRequestsPromisesCache[cacheKey]
        }

        //send REST request to our app to fetch all the editors
        apiRequestsPromisesCache[cacheKey] = $http.get(endpoint)
            .then(function(response) {
                NProgress.done();
                return response.data
            }, function(response) {
                debugger
                //action failed
                NProgress.done();
                return response
            });
        return apiRequestsPromisesCache[cacheKey]
    }

    this.uploadImage = function(pageId, fileData) {
        NProgress.start();
        //send REST request to our app to fetch all the editors
        return $http.post('/api/i/page/' + pageId + '/mod/upload/image', {
            base64: fileData.base64Url,
            fileExtension: fileData.fileExtension
        })
            .then(function(response){
                NProgress.done()
                return response.data;
            });
    }
})
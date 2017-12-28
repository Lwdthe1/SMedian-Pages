angularApp
    .service('ChatService', function($http) {
        var apiRequestsPromisesCache = {};

        this.startNewDirectThread = function(userId) {
            var endpoint = '/api/i/user/me/mod/chat/directThread'
            endpoint += '?' + SERVER_API_KEY_PARAM
            NProgress.start();
            return $http.post(endpoint, {userId: userId})
                .then((response) => {
                    return response.data
                })
        }

        this.startNewGroupThread = function(data) {
            var endpoint = '/api/i/user/me/mod/chat/groupThread'
            endpoint += '?' + SERVER_API_KEY_PARAM
            NProgress.start();
            return $http.post(endpoint, data)
                .then((response) => {
                    return response.data
                })
        }

        this.getThreads = function(pagingParams) {
            var endpoint = '/api/i/user/me/v/chat/threads'
            endpoint += '?' + SERVER_API_KEY_PARAM

            if(pagingParams) {
                endpoint += '&limit=' + pagingParams.getLimit()
                endpoint += '&from=' + pagingParams.getFrom()
            }

            const cacheKey = 'GET:' + endpoint
            if(apiRequestsPromisesCache[cacheKey]) {
                NProgress.done();
                return apiRequestsPromisesCache[cacheKey]
            }
            
            apiRequestsPromisesCache[cacheKey] = $http.get(endpoint)
                .then(function(response) {
                    NProgress.done();
                    return response.data
                })
            return apiRequestsPromisesCache[cacheKey]
        }

        this.getThreadMessages = function(threadId, pagingParams) {
            var endpoint = '/api/i/user/me/v/chat/thread/' + threadId + '/messages'
            endpoint += '?' + SERVER_API_KEY_PARAM

            if(pagingParams) {
                endpoint += '&limit=' + pagingParams.getLimit()
                endpoint += '&from=' + pagingParams.getFrom()
            }

            const cacheKey = 'GET:' + endpoint
            if(apiRequestsPromisesCache[cacheKey]) {
                NProgress.done();
                return apiRequestsPromisesCache[cacheKey]
            }
            
            apiRequestsPromisesCache[cacheKey] = $http.get(endpoint)
                .then(function(response) {
                    NProgress.done();
                    return response.data
                })
            return apiRequestsPromisesCache[cacheKey]
        }

        this.getUnseenCount = function() {
            var endpoint = '/api/i/user/me/mod/chat/threads/unseen/count'
            endpoint += '?' + SERVER_API_KEY_PARAM
            return $http.get(endpoint)
        }

        this.sendMessage = function(threadId, data) {
            if (!data.text || !data.text.trim().length) return $.Deferred().reject(new Error('Invalid text'))
            var endpoint = '/api/i/user/me/mod/chat/thread/' + threadId + '/message'
            endpoint += '?' + SERVER_API_KEY_PARAM
            return $http.post(endpoint, data)
                .then((response) => {
                    return response.data
                })
        }

        this.saveNotificationSettings = function(data) {
            if (!data && !Object.keys(data).length) return $.Deferred().reject(new Error('Invalid data'))
            var endpoint = '/api/i/user/me/mod/chat/settings'
            endpoint += '?' + SERVER_API_KEY_PARAM
            return $http.put(endpoint, data)
                .then((response) => {
                    return response.data
                })
        }

        this.markThreadLastSeen = function(threadId) {
            if (!threadId) return onFail(new Error('Missing or invalid thread provided.'))
            var endpoint = '/api/i/user/me/mod/chat/thread/' + threadId + '/seen'
            endpoint += '?' + SERVER_API_KEY_PARAM
            return $http.put(endpoint)
        }

        this.deleteThreadMessage = function(threadId, messageId) {
            if (!threadId) return onFail(new Error('Missing or invalid thread provided.'))
            if (!messageId) return onFail(new Error('Missing or invalid thread provided.'))
            var endpoint = '/api/i/user/me/mod/chat/thread/' + threadId + '/message/' + messageId
            endpoint += '?' + SERVER_API_KEY_PARAM
            return $http.delete(endpoint)
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

        this.getCurrentUserInviteLink = function() {
            const endpoint = '/api/i/user/me/v/chat/inviteLink'
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
                });
            return apiRequestsPromisesCache[cacheKey]
        }
    })
SmedianPages.service.NetworkService = function() {
    this.get = (opts) => {
        if(!opts.url) return
        try{opts.onStart()}catch(err){}
        $.get(opts.url)
            .done((data) => {
                try {
                    opts.onSuccess(data)
                } catch(err) {}
            })
            .fail((res) => {
                try {
                    opts.onFail(res)
                } catch(err) {}
            })
    }

    this.post = (opts) => {
        if(!opts.url) return
        try{opts.onStart()}catch(err){}
        $.post(opts.url, opts.body)
            .done((data) => {
                try {
                    opts.onSuccess(data)
                } catch(err) {}
            })
            .fail((res) => {
                try {
                    opts.onFail(res)
                } catch(err) {}
            })
    }

    this.put = (opts) => {
        if(!opts.url) return
        try{opts.onStart()}catch(err){}
        $.put(opts.url, opts.body)
            .done((data) => {
                try {
                    opts.onSuccess(data)
                } catch(err) {}
            })
            .fail((res) => {
                try {
                    opts.onFail(res)
                } catch(err) {}
            })
    }

    this.delete = (opts) => {
        if(!opts.url) return
        try{opts.onStart()}catch(err){}
        $.delete(opts.url)
            .done((data) => {
                try {
                    opts.onSuccess(data)
                } catch(err) {}
            })
            .fail((res) => {
                try {
                    opts.onFail(res)
                } catch(err) {}
            })
    }
}

SmedianPagesUtilManager.PageAdminNetworkService = function() {
    var apiRequestsPromisesCache = {}
    const $ = new SmedianPagesUtilManager.NetworkService()
    
    this.save = function(pageId, data, onSuccess, onFail) {
        var endpoint = '/api/i/page/' + pageId + '/mod/draft'
        endpoint += '?' + SERVER_API_KEY_PARAM

        return $.put({
            url: endpoint, 
            body: data.draftData, 
            onSuccess: (response) => {
                try{onSuccess(response.data)}catch(err) {}
            },
            onFail: onFail
        })
    }

    this.publish = function(pageId, onSuccess, onFail) {
        var endpoint = '/api/i/page/' + pageId + '/mod/publish'
        endpoint += '?' + SERVER_API_KEY_PARAM

        return $.put({
            url: endpoint,
            onSuccess: (response) => {
                try{onSuccess(response.data)}catch(err) {}
            },
            onFail: onFail
        })
    }

    this.getMediumtArticleData = function(url, onSuccess, onFail) {
        const endpoint = '/api/e/service/medium/articleJson?url=' + url
        const cacheKey = 'GET:' + endpoint
        
        if(apiRequestsPromisesCache[cacheKey]) {
            try{onSuccess(apiRequestsPromisesCache[cacheKey])}catch(err) {}
        }

        return $.get({
            url: endpoint, 
            onSuccess: (response) => {
                apiRequestsPromisesCache[cacheKey] = data
                try{onSuccess(response.data)}catch(err) {}
            },
            onFail: onFail
        })
    }

    this.uploadImage = function(pageId, fileData, onSuccess, onFail) {
        return $.put({
            url: '/api/i/page/' + pageId + '/mod/upload/image', 
            body: {
                base64: fileData.base64Url,
                fileExtension: fileData.fileExtension
            }, 
            onSuccess: (response) => {
                try{onSuccess(response.data)}catch(err) {}
            },
            onFail: onFail
        })
    }
}
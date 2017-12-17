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

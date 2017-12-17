SmedianPages.service.NetworkService = function() {
    this.get = (opts) => {
        if(!opts.url) return
        try{opts.onStart()}catch(err){}
        $.ajax(opts.url)
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
        $.ajax({
            method: "POST",
            url: opts.url,
            data: opts.body
        })
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
        $.ajax({
            method: "PUT",
            url: opts.url,
            data: opts.body
        })
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
        $.ajax({
            method: "DELETE",
            url: opts.url,
        })
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

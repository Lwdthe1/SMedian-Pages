const SMedianPageComponentPhotoGallery = function(config) {
    if(!config) throw new Error('[SMedianPageComponentPhotoGallery] config data is required')
    if(!config.angularScope) throw new Error('[SMedianPageComponentActionsMenu] angularScope is required')
    if(!config.angularScopeUIUpdator) throw new Error('[SMedianPageComponentActionsMenu] angularScopeUIUpdator is required')
    if (!config.PageAdminService) throw new Error('[SMedianPageComponentPhotoGallery] PageAdminService is required.')
    if (!config.PageAdminService.uploadImage) throw new Error('[SMedianPageComponentPhotoGallery] PageAdminService must have an uploadImage method.')
    
    const self = this
    const $scope = config.angularScope
    const PageAdminService = config.PageAdminService
    const angularScopeUIUpdator = config.angularScopeUIUpdator

    const imageIdsMap = {}
    const _images = []
    this.images = _images
    this.addImage = addImage
    function addImage(image) {
        if(!image) return
        if(imageIdsMap[image.id]) return
        imageIdsMap[image.id] = image
        _images.push(image)
    }

    try {
        config.images.forEach(addImage)
    } catch(err) {
    }

    var alreadyAttachedImageUploader
    this.openImageFileSelect = openImageFileSelect
    function openImageFileSelect() {
        $('.js-SmedianPageComponentPhotoGallery-startImageUpload').click()
        if(alreadyAttachedImageUploader) return
        alreadyAttachedImageUploader = true
        attachJQueryImageUploadBase64BySelector('.js-SmedianPageComponentPhotoGallery-startImageUpload', (data) => {
            delete self.uploadError
            self.isUploading = true
            PageAdminService.uploadImage($scope.pageId, {
                base64Url: data.base64Url,
                fileExtension: data.fileExtension
            })
                .then((scImage) => {
                    self.images.push(scImage)
                    angularScopeUIUpdator(() => {
                        self.isUploading = false
                    })
                }, (err) => {
                    if(err.status == 413) {
                        err = new Error('Image must be less than 1MB to upload.')
                    } else {
                        err = new Error('Unknown error.')
                    }
                    self.isUploading = false
                    self.uploadError = err
                })
        }, (err) => {
            debugger
            self.isUploading = false
            self.uploadError = err
        })
    }

    this.toggleShow = config.toggleShow || function(show) {
        angularScopeUIUpdator(() => {
            self.show = show != undefined ? show : !self.show
        })
    }
    this.onSelectImage = onSelectImage
    function onSelectImage(image) {
        self.lastImage = image
        try {
            config.onSelectImage(image)
        } catch(err) {}
        self.show = false
    }

    function getBase64(file, onSuccess, onError) {
        if(!onSuccess) onSuccess = () => {}
        if(!onError) onError = () => {}
        try {
            if(!file) return onError(new Error('no file provided'))
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
            onSuccess(reader.result);
            };
            reader.onerror = function (err) {
                onError(err)
            }
        } catch(err) {}
     }
    
    function attachJQueryImageUploadBase64BySelector(selector, onBase64, onFail) {
        if(!selector) return
        $(selector).on('change', function(e) {
            try {
                if(!onBase64) onBase64 = () => {}
                if(!onFail) onFail = () => {}
                
                var file = e.originalEvent.target.files[0];
                var supportedFileTypesMap = {'image/jpeg': true, 'image/png': true, 'image/gif': true};
                if(!supportedFileTypesMap[file.type]) {
                    return onFail(new Error('Not a supported image file: ' + file.type))
                }
                getBase64(file, (base64Url) => {
                    if(getBase64SizeKb(base64Url) > 60144 /* 6MB*/) {
                        debugger
                        return onFail && onFail(new Error('Image must be smaller than 1MB'))
                    }
                    downscaleImage({
                        dataUrl: base64Url,
                        onSuccess: (base64Url) => {
                            onBase64({
                                base64Url: base64Url,
                                fileExtension: file.type.replace('image/', '')
                            })
                        },
                        onFail: () => {
                            onBase64({
                                base64Url: base64Url,
                                fileExtension: file.type.replace('image/', '')
                            }) 
                        }
                    })
                }, onFail)
            } catch(err) {}
        })
    }

    // Take an image URL, downscale it to the given width, and return a new image URL.
    function downscaleImage(opts) {
        "use strict";
        var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;
        
        var dataUrl = opts.dataUrl
        var newWidth = opts.newWidth
        var imageType = opts.imageType
        var imageQuality = opts.imageQuality
        var onSuccess = opts.onSuccess
        var tries = opts.tries || 1
        // Provide default values
        imageType = imageType || "image/jpeg";
        imageQuality = imageQuality || 0.7;

        // Create a temporary image so that we can compute the height of the downscaled image.
        image = new Image();
        image.src = dataUrl;
        oldWidth = image.width;
        oldHeight = image.height;
        if(oldWidth == 0 && tries < 4) {
            setTimeout(() => {
                downscaleImage({
                    dataUrl: dataUrl,
                    newWidth: newWidth,
                    imageType: imageType,
                    imageQuality: imageQuality,
                    onSuccess: onSuccess,
                    tries: tries++
                })
            }, 250)
            return
        } else if(oldWidth == 0 && tries >= 4) {
            return opts.onFail && opts.onFail(new Error('Could not process that image.'))
        }
        newWidth = newWidth != undefined && newWidth > 0 ? newWidth : oldWidth;
        newHeight = Math.floor(oldHeight / oldWidth * newWidth)

        // Create a temporary canvas to draw the downscaled image on.
        canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        var ctx = canvas.getContext("2d");

        // Draw the downscaled image on the canvas and return the new data URL.
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        newDataUrl = canvas.toDataURL(imageType, imageQuality);
        console.log('Compressed image from ' + getBase64SizeKb(dataUrl) + ' kb to ' + getBase64SizeKb(newDataUrl) + ' kb')
        onSuccess(newDataUrl);
    }

    function getBase64SizeKb(base64Url) {
        if (!base64Url) return
        return 2*Math.ceil(base64Url.length/3) /1000
    }
}

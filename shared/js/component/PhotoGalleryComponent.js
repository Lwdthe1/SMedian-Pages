SmedianPages.component.PhotoGallery = function(config) {
    if(!config) throw new Error('[SMedianPageComponentPhotoGallery] config data is required')
    if(!config.page) throw new Error('[SMedianPageComponentPhotoGallery] config must have a page')
    if(!config.page.id) throw new Error('[SMedianPageComponentPhotoGallery] config must have a valid page')

    const self = this
    const _page = config.page
    const _pageId = config.page.id
    const _adminNetworkService = new SmedianPages.service.AdminNetworkService()

    const _imageIdsMap = {}
    const _images = []

    this.getImges = () => _images
    this.addImage = _addImage

    function _addImage(image) {
        if(!image) return
        if(_imageIdsMap[image.id]) return
        _imageIdsMap[image.id] = image
        _images.push(image)

        _imagesContainer.prepend(_templatePhoto(image))
    }

    try { config.images.forEach(_addImage) } catch(err) {}

    var alreadyAttachedImageUploader
    var _openImageFileSelectButtonSelector = '.js-SmedianPageComponentPhotoGallery-openImageFileSelectButton'
    var _imageUploadProgressSelector = '.js-SmedianPageComponentPhotoGallery-imageUploadProgress'
    var _closeButtonSelector = '.js-SmedianPageComponentPhotoGallery-closeButton'
    var _selectImageSelector = '.js-SmedianPageComponentPhotoGallery-selectImage'
    var _imagesContainer = '.js-SmedianPageComponentPhotoGallery-imagesContainer'
    var _imageUploadErrorLabelSelector = '.js-SmedianPageComponentPhotoGallery-imageUploadError'

    const _templatePhoto = (image) => `<a class="smpscss-masonry-grid-item" data-image-id="${image.id}"><img ng-src="${image.url}"></a>`

    this.attachActions = _attachActions
    
    function _attachActions() {
        // remove existing hooks
        $(_openImageFileSelectButtonSelector).unbind()
        $(_closeButtonSelector).unbind()
        $(_selectImageSelector).unbind()

        // attach hooks
        $(_openImageFileSelectButtonSelector).click(() => {
            _openImageFileSelect()
        })

        $(_closeButtonSelector).click(() => {
            _toggleShow()
        })

        $(_selectImageSelector).click(() => {
            const imageId = $(this).data('image-id')
            _onSelectImage(_imageIdsMap[imageId])
        })
    }

    var _isUploading = false
    function _toggleIsUploading(status, err) {
        _isUploading = !!status
        if (_isUploading) {
            $(_imageUploadProgressSelector).show()
            $(_imageUploadErrorLabelSelector).hide()
        } else {
            $(_imageUploadProgressSelector).hide()
        }
        if (err) {
            $(_imageUploadErrorLabelSelector).text(`Failed to upload that image due to: ${err.message}`)
            $(_imageUploadErrorLabelSelector).show()
        }
    }

    this.openImageFileSelect = _openImageFileSelect
    function _openImageFileSelect() {
        $('.js-SmedianPageComponentPhotoGallery-startImageUpload').click()
        if(alreadyAttachedImageUploader) return
        alreadyAttachedImageUploader = true
        _attachJQueryImageUploadBase64BySelector('.js-SmedianPageComponentPhotoGallery-startImageUpload', (data) => {
            delete self.uploadError
            _toggleIsUploading(true)
            _adminNetworkService.uploadImage(_pageId, {
                base64Url: data.base64Url,
                fileExtension: data.fileExtension
            }, (scImage) => {
                _addImage(scImage)
                _toggleIsUploading()
            }, (res) => {
                var err
                if(res.status == 413) {
                    err = new Error('Image must be less than 1MB to upload.')
                } else {
                    err = new Error('Unknown error.')
                }
                _toggleIsUploading(false, err)
            })
        }, (err) => {
            _toggleIsUploading(false, err)
        })
    }

    this.toggleShow = function(show) {
        _toggleShow(show)
    }

    var _isShown = false
    function _toggleShow(show) {
        _isShown = show != undefined ? show : !_isShown
        if(_isShown) {
            _getEl().show()
        } else {
            _getEl().hide()
        }
    }

    function _getEl() {
        return $('.js-SmedianPageComponentPhotoGallery')
    }

    this.onSelectImage = _onSelectImage
    function _onSelectImage(image) {
        self.lastImage = image
        try {
            config.onSelectImage(image)
        } catch(err) {}
        self.show = false
    }

    function _getBase64(file, onSuccess, onError) {
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
    
    function _attachJQueryImageUploadBase64BySelector(selector, onBase64, onFail) {
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
                _getBase64(file, (base64Url) => {
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

    function _fetchAndAttachHtml() {
        if (_getEl().length) {
            _attachActions()
            return
        }
        
        const iframeId = Date.now() + 'jfkhgd-dsfiuy897y9rihjwek-iframe'
        var iframe = document.createElement('iframe');
        iframe.style.display = "none";
        iframe.id = iframeId
        iframe.src = '/vendor_node/smedian-pages/shared/views/component/photoGalleryComponent.html'
        iframe.onload = (_, html) => {
            $('body').append(document.getElementById(iframeId).contentWindow.document.body.innerHTML)
            setTimeout(() => {_attachActions()}, 250)
        }
        document.body.appendChild(iframe);
    }

    if (!config.awaitAttachActionsMesage) {
        _fetchAndAttachHtml()
    }
}

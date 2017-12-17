(() => {
angularApp
	.controller('AppCtrl', function AppCtrl($scope, $sce, $window, $location, $timeout, $routeParams, SocketIO, PageAdminService) {
        _SocketIO = SocketIO
        
        const ssrCData = SmedianPages.getSsrCData()
        $scope.currentUser = SmedianPages.CurrentUser.get();
        $scope.page = ssrCData.page.pageEditor.page
        $scope.pageId = $scope.page.id
        $scope.pub = $scope.page.masterObject
        $scope.page.draftData = prepareDraftData($scope.page, $scope.pub)
        $scope.draftData = $scope.page.draftData
        $scope.saved = false

        $scope.photoGallery = new SmedianPages.component.PhotoGallery({
            page: $scope.page,
            images: $scope.page.scTypedArrayOfImage.values,
            onSelectImage: (image) => {
                $scope.onPhotoGallerySelectedImage(image)
            }
        })

        $scope.$on('socket:user_send_access_token', () => {
            sendCurrentUserAccessTokenToServerSocket()
        })

        $scope.$on('socket:user_send_access_token', () => {
            sendCurrentUserAccessTokenToServerSocket()
        })

        function sendCurrentUserAccessTokenToServerSocket() {
            if(SmedianPages.CurrentUser.get()) SocketIO.emit('user_accessToken', SmedianPages.CurrentUser.getAccessToken());
        }
        
        $scope.addContainerFor = function(type) {
            switch (type) {
                case 'featuredStories':
                    $scope.addFeaturedStory()
                    break
                case 'footerLinks':
                    $scope.addFooterLink()
                    break
                default:
                    break
            }
        }

        $scope.addFeaturedStory = function() {
            const currentLength = $scope.draftData.featuredStoriesSection.stories.length
            $scope.draftData.featuredStoriesSection.stories.push({
                position: currentLength
            })
        }

        $scope.addFooterLink = function() {
            if($scope.draftData.footerSection.links.length >= 3) return
            $scope.draftData.footerSection.links.push({})
        }

        $scope.removeFeaturedStory = (featuredStory) => {
            if(!$scope.draftData.featuredStoriesSection.stories.length) return
            $scope.draftData.featuredStoriesSection.stories = $scope.draftData.featuredStoriesSection.stories.filter((story) => {
                return story != featuredStory
            })
            $scope.onDraftDataChange()
        }

        $scope.removeFooterLink = (footerLink) => {
            if(!$scope.draftData.footerSection.links.length) return
            $scope.draftData.footerSection.links = $scope.draftData.footerSection.links.filter((link) => {
                return link != footerLink
            })
            $scope.onDraftDataChange()
        }

        $scope.fetchingFeatureStoryUrls = {}
        $scope.getFeaturedMediumArticleData = (featuredStory) => {
            if(!featuredStory.url || !featuredStory.url.trim().length) return
            const url = featuredStory.url.trim()
            if($scope.fetchingFeatureStoryUrls[url]) return
            $scope.fetchingFeatureStoryUrls[url] = true
            PageAdminService.getMediumtArticleData(url)
                .then((response) => {
                    $scope.fetchingFeatureStoryUrls[url] = false
                    try {
                        if(!featuredStory.title || !featuredStory.title.length) featuredStory.title = response.articleData.title
                        if(!featuredStory.description || !featuredStory.description.length) featuredStory.description = response.articleData.subtitle
                        if(!featuredStory.imageUrl || !featuredStory.imageUrl.length) featuredStory.imageUrl = response.articleData.imageUrl
                    } catch(err) {
                        debugger
                    }
                }, (err) => {
                    $scope.fetchingFeatureStoryUrls[url] = false
                })
        }

        $scope.openImageGallery = function(type, opt_object) {
            $scope.smedianPageComponent_photoGallery.toggleShow(true)
            $scope.onPhotoGallerySelectedImage = (image) => {
                $timeout(() => {
                    switch(type) {
                        case 'story':
                            opt_object.imageUrl = image.url
                            break
                        case 'page.draftData.heroSection.backgroundImageUrl':
                            $scope.page.draftData.heroSection.backgroundImageUrl = image.url
                            break
                        case 'page.draftData.seo.imageUrl':
                            $scope.page.draftData.seo.imageUrl = image.url
                            break
                        case 'page.draftData.about.logoUrl':
                            $scope.page.draftData.about.logoUrl = image.url
                            break
                        case 'page.draftData.newsletterForm.successImageUrl':
                            $scope.page.draftData.newsletterForm.successImageUrl = image.url
                            break
                        case 'page.draftData.contactForm.successImageUrl':
                            $scope.page.draftData.contactForm.successImageUrl = image.url
                            break
                        case 'page.draftData.footerSection.backgroundImageUrl':
                            $scope.page.draftData.footerSection.backgroundImageUrl = image.url
                            break
                    }
                })
            }
        }

        $scope.onDraftDataChange = () => {
            $scope.saved = false
            $scope.published = false
        }

        $scope.saveChanges = () => {
            PageAdminService.save($scope.pageId, { draftData: $scope.draftData })
                .then((r) => {
                    debugger
                    $scope.saved = true
                }, (err) => {
                    NProgress.done()
                    debugger
                })
        }

        $scope.publishDraft = () => {
            PageAdminService.publish($scope.pageId)
                .then((r) => {
                    debugger
                    $scope.published = true
                }, (err) => {
                    debugger
                })
        }

        
        window.onbeforeunload = function() {
            if(!$scope.saved) {
                return 'WARNING: Are you sure you want to leave? You have unsaved changes that will be lost if you leave without saving.'
            }
        }
    })

    function prepareDraftData(page, pub) {
        const isObj = ObjectUtils.isObj
        const isArray = ArrayUtils.isArray
        const draftData = page.draftData

        function ensureField(obj, field, defaultValue) {
            if(!obj[field]) obj[field] = defaultValue
            return obj[field]
        }

        function ensureArrayFieldNotEmpty(obj, field, firstValue) {
            if(!isArray(obj[field])) obj[field] = []
            if(!obj[field].length && firstValue) obj[field].push(firstValue)
        }

        function ensureBoolField(obj, field, defaultValue) {
            if(obj[field] + '' != 'true' && obj[field] + '' != 'false') {
                debugger
                obj[field] = !!defaultValue
            }
        }
        function notExist(x) { return !x}
        function notExistWithLength(x) { return !x || !x.length}

        //--SEO
        ensureField(draftData, 'seo', {})
        ensureField(draftData.seo, 'title', pub.name)
        ensureField(draftData.seo, 'description', pub.description)
        ensureField(draftData.seo, 'imageUrl', pub.imageUrl)
        ensureField(draftData.seo, 'keywords', pub.name && pub.name + ', ' + pub.name.replace('and', '').replace('the','').split(' ').join(', ') || '')
        
        
        //--About
        ensureField(draftData, 'about', {})
        ensureField(draftData.about, 'name', pub.name)
        ensureField(draftData.about, 'description', pub.description)
        ensureField(draftData.about, 'logoUrl', pub.imageUrl)

        //--Hero section
        ensureField(draftData, 'heroSection', {})
        ensureField(draftData.heroSection, 'title', pub.name)
        ensureField(draftData.heroSection, 'subtitle', pub.description)
        ensureField(draftData.heroSection, 'backgroundImageUrl', '/vendor_node/smedian-pages/templates/pub/t1/v1_0/page/images/thought-catalog-214785-min.jpg')
        ensureField(draftData.heroSection, 'backgroundColor', '1abc9c')
        ensureField(draftData.heroSection, 'textColor', 'ffffff')
        ensureField(draftData.heroSection, 'bottomAccentLineColor', '1abc9c')
        //request to contribute
        ensureBoolField(draftData.heroSection, 'showRequestToConributeButton', true)
        ensureField(draftData.heroSection, 'requestToContributeButton', {})
        ensureField(draftData.heroSection.requestToContributeButton, 'backgroundColor', '1abc9c')
        ensureField(draftData.heroSection.requestToContributeButton, 'textColor', 'ffffff')
        ensureField(draftData.heroSection.requestToContributeButton, 'text', 'Request to Contribute')
        //newsletter button
        ensureBoolField(draftData.heroSection, 'showNewsletterButton', false)
        ensureField(draftData.heroSection, 'newsletterButton', {})
        ensureField(draftData.heroSection.newsletterButton, 'backgroundColor', '1abc9c')
        ensureField(draftData.heroSection.newsletterButton, 'textColor', 'ffffff')
        ensureField(draftData.heroSection.newsletterButton, 'text', 'Join Our Newsletter')
        //contact button
        ensureBoolField(draftData.heroSection, 'showContactButton', false)
        ensureField(draftData.heroSection, 'contactButton', {})
        ensureField(draftData.heroSection.contactButton, 'backgroundColor', '1abc9c')
        ensureField(draftData.heroSection.contactButton, 'textColor', 'ffffff')
        ensureField(draftData.heroSection.contactButton, 'text', 'Contact Us')
        
        //--About Us section
        ensureBoolField(draftData, 'showAboutSection', true)
        ensureField(draftData, 'aboutSection', {})
        ensureField(draftData.aboutSection, 'description', pub.description)
        ensureBoolField(draftData.aboutSection, 'showStats', true)

        ensureField(draftData, 'navigationBarLogo', {})
        ensureField(draftData.navigationBarLogo, 'logoUrl', pub.imageUrl)
        ensureField(draftData.navigationBarLogo, 'text', pub.name)
        ensureBoolField(draftData.navigationBarLogo, 'includeText', false)
        //--Social Links Section
        ensureSocialLinks()

        //--Featured Stories Section
        ensureField(draftData, 'featuredStoriesSection', {})
        ensureField(draftData.featuredStoriesSection, 'title', 'Featured Stories')
        ensureField(draftData.featuredStoriesSection, 'description', '')
        ensureField(draftData.featuredStoriesSection, 'moreStoriesButton', {
            show: false,
            url: 'http://medium.com/' + pub.urlSlug,
            text: 'Read More Stories'
        })
        ensureArrayFieldNotEmpty(draftData.featuredStoriesSection, 'stories')

        //--Newsletter Form
        ensureBoolField(draftData, 'showNewsletterForm', false)
        ensureField(draftData, 'newsletterForm', {})
        
        ensureField(draftData.newsletterForm, 'successTitle', 'Thanks for Signup Up')
        ensureField(draftData.newsletterForm, 'successText', 'You will hear from us soon!')
        ensureField(draftData.newsletterForm, 'successImageUrl', '')
        ensureField(draftData.newsletterForm, 'successCTAUrl', '')
        ensureField(draftData.newsletterForm, 'successCTAText', '')
        ensureBoolField(draftData.newsletterForm, 'includeNameField', false)
        ensureField(draftData.newsletterForm, 'submitButton', {})
        ensureField(draftData.newsletterForm.submitButton, 'text', 'Sign Up')
        ensureField(draftData.newsletterForm.submitButton, 'backgroundColor', '1abc9c')
        

        //--Contact Us Form
        ensureBoolField(draftData, 'showContactForm', false)
        ensureField(draftData, 'contactForm', {})
        ensureField(draftData.contactForm, 'recipientEmail', '')
        ensureField(draftData.contactForm, 'successTitle', 'Thanks for Signup Up')
        ensureField(draftData.contactForm, 'successText', 'You will hear from us soon!')
        ensureField(draftData.contactForm, 'successImageUrl', '')
        ensureField(draftData.contactForm, 'successCTAUrl', '')
        ensureField(draftData.contactForm, 'successCTAText', '')
        ensureField(draftData.contactForm, 'submitButton', {})
        ensureField(draftData.contactForm.submitButton, 'backgroundColor', '1abc9c')
        ensureBoolField(draftData.contactForm, 'includeNameField', false)
        ensureBoolField(draftData.contactForm, 'includeCompanyField', false)
        ensureBoolField(draftData.contactForm, 'includeSubjectField', false)

        //--Request to Contribute Form
        ensureField(draftData, 'requestToContributeForm', {})
        ensureField(draftData.requestToContributeForm, 'submitButton', {})
        ensureField(draftData.requestToContributeForm.submitButton, 'backgroundColor', '1abc9c')
        ensureBoolField(draftData.requestToContributeForm, 'includeReferenceLinkFields', true)
        ensureBoolField(draftData.requestToContributeForm, 'includeNameField', false)
        ensureBoolField(draftData.requestToContributeForm, 'includeEmailField', false)
        ensureBoolField(draftData.requestToContributeForm, 'includeMessageField', false)
        ensureBoolField(draftData.requestToContributeForm, 'includeGoogleForm', false)

        //Footer Links
        ensureField(draftData, 'footerSection', {})
        ensureField(draftData.footerSection, 'backgroundImageUrl', '')
        ensureField(draftData.footerSection, 'backgroundColor', '1abc9c')
        ensureField(draftData.footerSection, 'textColor', 'ffffff')
        ensureArrayFieldNotEmpty(draftData.footerSection, 'links', {
            text: pub.name,
            url: 'https://medium.com/' + pub.urlSlug
        })

        function ensureSocialLinks() {
            function getOrCreate(type, name) {
                for(var i = 0; i < draftData.socialLinks.length; i++) {
                    const sl = draftData.socialLinks[i]
                    if(sl.type == type) return sl
                }
                const sl = { 
                    type: type,
                    name: name,
                    inputPlaceholder: 'https://' + type + '.com/...'
                }
                draftData.socialLinks.push(sl)
                return sl
            }
            ensureField(draftData, 'socialLinks', [])
            getOrCreate('medium', 'Medium')
            getOrCreate('linkedin', 'LinkedIn')
            getOrCreate('twitter', 'Twitter')
            getOrCreate('facebook', 'Facebook')
            getOrCreate('github', 'GitHub')
        }
        return draftData
    }
})()
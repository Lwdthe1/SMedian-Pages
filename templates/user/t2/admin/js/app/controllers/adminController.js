(() => {
angularApp
	.controller('AppCtrl', function AppCtrl($scope, $sce, $window, $location, $timeout, $routeParams, SocketIO, PageAdminService) {
        _SocketIO = SocketIO
        
        const ssrCData = MainApp.getSsrCData()
        $scope.currentUser = CurrentUser.get();
        $scope.page = ssrCData.page.pageEditor.page
        $scope.pageId = $scope.page.id
        $scope.user = $scope.page.masterObject
        
        $scope.page.draftData = prepareDraftData($scope.page, $scope.user)
        $scope.draftData = $scope.page.draftData

        $scope.saved = false

        $scope.smedianPageComponent_photoGallery = new SMedianPageComponentPhotoGallery({
            angularScope: $scope,
            angularScopeUIUpdator: (updateCallback) => {
                $timeout(() => {
                    updateCallback()
                })
            },
            PageAdminService: PageAdminService,
            images: $scope.page.scTypedArrayOfImage.values,
            onSelectImage: (image) => {
                $scope.onPhotoGallerySelectedImage(image)
            },
        })

        $scope.$on('socket:user_send_access_token', () => {
            sendCurrentUserAccessTokenToServerSocket()
        })

        $scope.$on('socket:user_send_access_token', () => {
            sendCurrentUserAccessTokenToServerSocket()
        })

        function sendCurrentUserAccessTokenToServerSocket() {
            if(CurrentUser.get()) SocketIO.emit('user_accessToken', CurrentUser.getAccessToken());
        }
        
        $scope.addContainerFor = function(type) {
            switch (type) {
                case 'skills':
                    $scope.addSkill()
                    break
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

        $scope.addSkill = function() {
            $scope.draftData.aboutSection.skills.push({
                name: '',
                description: '',
                levelOutOf100Pct: 10
            })
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

        $scope.updateSkillLevel = function(skill) {
            try {
            var v = Math.round(parseInt($('.js-skillLevel--' + skill.name.trim()).val() || 10))
            v = Math.max(v, 0)
            v = Math.min(v, 100)
            skill.level = v
            } catch(err) {
                debugger
            }
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
                        case 'page.draftData.seo.imageUrl':
                            $scope.page.draftData.seo.imageUrl = image.url
                            break
                        case 'page.draftData.about.logoUrl':
                            $scope.page.draftData.about.logoUrl = image.url
                            break
                        case 'page.draftData.heroSection.leftImageUrl':
                            $scope.page.draftData.heroSection.leftImageUrl = image.url
                            break
                        case 'page.draftData.aboutSection.leftImageUrl':
                            $scope.page.draftData.aboutSection.leftImageUrl = image.url
                            break    
                        case 'page.draftData.newsletterForm.leftImageUrl':
                            $scope.page.draftData.newsletterForm.leftImageUrl = image.url
                            break
                        case 'page.draftData.newsletterForm.successImageUrl':
                            $scope.page.draftData.newsletterForm.successImageUrl = image.url
                            break
                        case 'page.draftData.contactForm.leftImageUrl':
                            $scope.page.draftData.contactForm.leftImageUrl = image.url
                            break
                        case 'page.draftData.contactForm.successImageUrl':
                            $scope.page.draftData.contactForm.successImageUrl = image.url
                            break
                    }
                })
            }
        }

        $scope.onDraftDataChange = () => {
            $scope.saved = false
            $scope.published = false
        }

        $('input').on('change', function() {
            $scope.onDraftDataChange()
        })
        $('select').on('change', function() {
            $scope.onDraftDataChange()
        })

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

    function prepareDraftData(page, user) {
        const isObj = ObjectUtils.isObj
        const isArray = ArrayUtils.isArray
        const draftData = page.draftData

        function ensureField(obj, field, defaultValue) {
            if(!obj[field]) {
                obj[field] = defaultValue
            }
            return obj[field]
        }

        function ensureArrayFieldNotEmpty(obj, field, firstValue) {
            if(!isArray(obj[field])) obj[field] = []
            if(!obj[field].length && firstValue) {
                obj[field].push(firstValue)
            }
        }

        function ensureBoolField(obj, field, defaultValue) {
            if(obj[field] + '' != 'true' && obj[field] + '' != 'false') {
                obj[field] = !!defaultValue
            }
        }
        function notExist(x) { return !x}
        function notExistWithLength(x) { return !x || !x.length}
        
        var userTagsString = ''
        try {
            const numUserTags = user.tags.length
            for(var i = 0; i < numUserTags; i++) {
                userTagsString += user.tags[i] + (i == numUserTags - 1? '': ', ')
            }
        } catch(err) {}

        //--SEO
        ensureField(draftData, 'seo', {})
        ensureField(draftData.seo, 'title', user.name || user.username)
        ensureField(draftData.seo, 'description', user.bio)
        ensureField(draftData.seo, 'imageUrl', user.imageUrl)
        ensureField(draftData.seo, 'keywords', user.username + (user.name && ', ' + user.name || '') + (userTagsString.length && ', ' + userTagsString || ''))
        

        //--About
        ensureField(draftData, 'about', {})
        ensureField(draftData.about, 'name', user.name)
        ensureField(draftData.about, 'description', user.bio)
        ensureField(draftData.about, 'logoUrl', user.imageUrl)


        //--Hero section
        ensureField(draftData, 'heroSection', {})
        ensureField(draftData.heroSection, 'title', user.name || user.username)
        ensureField(draftData.heroSection, 'subtitle', user.bio)
        ensureField(draftData.heroSection, 'leftImageUrl', 'http://smedian.com/pages/templates/user/t2/page/images/pic01.jpg')
        ensureField(draftData.heroSection, 'rightBackgroundColor', 'ffffff')
        ensureField(draftData.heroSection, 'titleTextColor', '555555')
        ensureField(draftData.heroSection, 'subtitleTextColor', '555555')
        ensureBoolField(draftData.heroSection, 'showLeftImage', true)
        
        //about button
        ensureField(draftData.heroSection, 'aboutButton', {})
        ensureField(draftData.heroSection.aboutButton, 'backgroundColor', 'transparent')
        ensureField(draftData.heroSection.aboutButton, 'borderColor', '555555')
        ensureField(draftData.heroSection.aboutButton, 'textColor', '555555')
        ensureField(draftData.heroSection.aboutButton, 'text', 'About Me')
        ensureBoolField(draftData.heroSection.aboutButton, 'show', true)
        //featured stories button
        ensureField(draftData.heroSection, 'featuredStoriesButton', {})
        ensureField(draftData.heroSection.featuredStoriesButton, 'backgroundColor', 'transparent')
        ensureField(draftData.heroSection.featuredStoriesButton, 'borderColor', '555555')
        ensureField(draftData.heroSection.featuredStoriesButton, 'textColor', '555555')
        ensureField(draftData.heroSection.featuredStoriesButton, 'text', 'Featured Stories')
        ensureBoolField(draftData.heroSection.featuredStoriesButton, 'show', true)
        //hire button
        ensureBoolField(draftData.heroSection, 'showContactButton', true)
        ensureField(draftData.heroSection, 'contactFormButton', {})
        ensureField(draftData.heroSection.contactButton, 'backgroundColor', 'transparent')
        ensureField(draftData.heroSection.contactButton, 'borderColor', '555555')
        ensureField(draftData.heroSection.contactButton, 'textColor', '555555')
        ensureField(draftData.heroSection.contactButton, 'text', 'Hire Me')
        ensureBoolField(draftData.heroSection.contactButton, 'show', true)
        //newsletter button
        ensureBoolField(draftData.heroSection, 'showNewsletterButton', false)
        ensureField(draftData.heroSection, 'newsletterButton', {})
        ensureField(draftData.heroSection.newsletterButton, 'backgroundColor', 'transparent')
        ensureField(draftData.heroSection.newsletterButton, 'borderColor', '555555')
        ensureField(draftData.heroSection.newsletterButton, 'textColor', '555555')
        ensureField(draftData.heroSection.newsletterButton, 'text', 'Get My Newsletter')
        ensureBoolField(draftData.heroSection.newsletterButton, 'show', true)
        

        //--About Us section
        ensureField(draftData, 'aboutSection', {})
        ensureBoolField(draftData.aboutSection, 'show', true)
        ensureField(draftData.aboutSection, 'title', 'About Me')
        ensureField(draftData.aboutSection, 'subtitle', 'Just a writer trying to make my mark on the world.')
        ensureField(draftData.aboutSection, 'description', user.description)
        ensureField(draftData.aboutSection, 'leftImageUrl', user.imageUrl)
        ensureField(draftData.aboutSection, 'titleTextColor', '555555')
        ensureField(draftData.aboutSection, 'subtitleTextColor', '555555')
        ensureField(draftData.aboutSection, 'textColor', '555555')
        ensureBoolField(draftData.aboutSection, 'showLeftImage', true)
        ensureBoolField(draftData.aboutSection, 'showSkills', true)
        ensureArrayFieldNotEmpty(draftData.aboutSection, 'skills', {
            name: 'Writing',
            description: '',
            levelOutOf100Pct: 50
        })
        //back button
        ensureField(draftData.aboutSection, 'backButton', {})
        ensureField(draftData.aboutSection.backButton, 'backgroundColor', 'transparent')
        ensureField(draftData.aboutSection.backButton, 'borderColor', '555555')
        ensureField(draftData.aboutSection.backButton, 'textColor', '555555')
        

        //--Social Links Section
        ensureSocialLinks()


        //--Featured Stories Section
        ensureField(draftData, 'featuredStoriesSection', {})
        ensureBoolField(draftData.featuredStoriesSection, 'show', true)
        ensureBoolField(draftData.featuredStoriesSection, 'showLeftImage', true)
        ensureField(draftData.featuredStoriesSection, 'title', 'Featured Stories')
        ensureField(draftData.featuredStoriesSection, 'subtitle', 'Read my best work.')
        ensureField(draftData.featuredStoriesSection, 'description', '')
        ensureField(draftData.featuredStoriesSection, 'leftImageUrl', user.imageUrl)
        ensureField(draftData.featuredStoriesSection, 'titleTextColor', '555555')
        ensureField(draftData.featuredStoriesSection, 'subtitleTextColor', '555555')
        ensureField(draftData.featuredStoriesSection, 'textColor', '555555')
        ensureArrayFieldNotEmpty(draftData.featuredStoriesSection, 'stories')
        //back button
        ensureField(draftData.featuredStoriesSection, 'backButton', {})
        ensureField(draftData.featuredStoriesSection.backButton, 'backgroundColor', 'transparent')
        ensureField(draftData.featuredStoriesSection.backButton, 'borderColor', '555555')
        ensureField(draftData.featuredStoriesSection.backButton, 'textColor', '555555')


        //--Newsletter Form
        ensureField(draftData, 'newsletterForm', {})
        ensureBoolField(draftData.newsletterForm, 'show', true)
        ensureBoolField(draftData.newsletterForm, 'showLeftImage', true)
        ensureField(draftData.newsletterForm, 'title', 'Get My Newsletters')
        ensureField(draftData.newsletterForm, 'description', '')
        ensureField(draftData.newsletterForm, 'leftImageUrl', user.imageUrl)
        ensureField(draftData.newsletterForm, 'titleTextColor', '555555')
        ensureField(draftData.newsletterForm, 'subtitleTextColor', '555555')
        ensureField(draftData.newsletterForm, 'textColor', '555555')
        ensureField(draftData.newsletterForm, 'successTitle', 'Thanks for Signup Up')
        ensureField(draftData.newsletterForm, 'successText', 'You will hear from us soon!')
        ensureField(draftData.newsletterForm, 'successImageUrl', '')
        ensureField(draftData.newsletterForm, 'successCTAUrl', '')
        ensureField(draftData.newsletterForm, 'successCTAText', '')
        ensureBoolField(draftData.newsletterForm, 'includeNameField', false)
        ensureField(draftData.newsletterForm, 'submitButton', {})
        ensureField(draftData.newsletterForm.submitButton, 'text', 'Sign Up')
        ensureField(draftData.newsletterForm.submitButton, 'backgroundColor', 'transparent')
        ensureField(draftData.newsletterForm.submitButton, 'borderColor', '555555')
        ensureField(draftData.newsletterForm.submitButton, 'textColor', '555555')
        //back button
        ensureField(draftData.newsletterForm, 'backButton', {})
        ensureField(draftData.newsletterForm.backButton, 'backgroundColor', 'transparent')
        ensureField(draftData.newsletterForm.backButton, 'borderColor', '555555')
        ensureField(draftData.newsletterForm.backButton, 'textColor', '555555')
        

        //--Contact Us Form
        ensureField(draftData, 'contactForm', {})
        ensureBoolField(draftData.contactForm, 'show', true)
        ensureBoolField(draftData.contactForm, 'showLeftImage', true)
        ensureField(draftData.contactForm, 'title', 'Contact Me')
        ensureField(draftData.contactForm, 'description', '')
        ensureField(draftData.contactForm, 'leftImageUrl', user.imageUrl)
        ensureField(draftData.contactForm, 'titleTextColor', '555555')
        ensureField(draftData.contactForm, 'subtitleTextColor', '555555')
        ensureField(draftData.contactForm, 'textColor', '555555')
        ensureField(draftData.contactForm, 'recipientEmail', '')
        ensureField(draftData.contactForm, 'subjectFieldPlaceholder', 'Subject')
        ensureField(draftData.contactForm, 'messageFieldPlaceholder', '')
        ensureBoolField(draftData.contactForm, 'includeSubjectField', false)
        ensureField(draftData.contactForm, 'successTitle', 'Thanks for Signup Up')
        ensureField(draftData.contactForm, 'successText', 'You will hear from us soon!')
        ensureField(draftData.contactForm, 'successImageUrl', '')
        ensureField(draftData.contactForm, 'successCTAUrl', '')
        ensureField(draftData.contactForm, 'successCTAText', '')
        ensureField(draftData.contactForm, 'submitButton', {})
        ensureField(draftData.contactForm.submitButton, 'backgroundColor', '1abc9c')
        ensureField(draftData.contactForm.submitButton, 'borderColor', '555555')
        ensureField(draftData.contactForm.submitButton, 'textColor', '555555')
        //back button
        ensureField(draftData.contactForm, 'backButton', {})
        ensureField(draftData.contactForm.backButton, 'backgroundColor', 'transparent')
        ensureField(draftData.contactForm.backButton, 'borderColor', '555555')
        ensureField(draftData.contactForm.backButton, 'textColor', '555555')
        

        //Footer Links
        ensureField(draftData, 'footerSection', {})
        ensureField(draftData.footerSection, 'copyrightText', user.name || user.username)
        ensureField(draftData.footerSection, 'textColor', 'ffffff')
        ensureArrayFieldNotEmpty(draftData.footerSection, 'links', {
            text: 'Medium Profile',
            url: 'https://medium.com/@' + user.username
        })

        function ensureSocialLinks() {
            function getOrCreate(type, name, placeholer) {
                for(var i = 0; i < draftData.socialLinks.length; i++) {
                    const sl = draftData.socialLinks[i]
                    if(sl.type == type) return sl
                }
                const sl = { 
                    type: type,
                    name: name,
                    inputPlaceholder: placeholer || 'https://' + type + '.com/...'
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
            getOrCreate('dribbble', 'Dribbble')
            getOrCreate('behance', 'Behance', 'https://behance.net/...')
            getOrCreate('instagram', 'Instagram')
        }
        return draftData
    }
})()
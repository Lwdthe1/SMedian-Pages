(() => {
angularApp
	.controller('AppCtrl', function AppCtrl($scope, $sce, $window, $location, $timeout, $routeParams, SocketIO, PageAdminService) {
        _SocketIO = SocketIO
        
        const ssrCData = SmedianPages.getSsrCData()
        $scope.currentUser = SmedianPages.CurrentUser.get();
        $scope.page = ssrCData.page.pageEditor.page
        $scope.pageId = $scope.page.id
        $scope.user = $scope.page.masterObject
        
        $scope.page.draftData = prepareDraftData($scope.page, $scope.user)
        $scope.draftData = $scope.page.draftData

        $scope.saved = false

        $scope.photoGallery = new SmedianPages.component.PhotoGallery({
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
            if(CurrentUser.get()) SocketIO.emit('user_accessToken', SmedianPages.CurrentUser.getAccessToken());
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
            $scope.photoGallery.toggleShow(true)
            $scope.onPhotoGallerySelectedImage = (image) => {
                $timeout(() => {
                    switch(type) {
                        case 'story':
                            opt_object.imageUrl = image.url
                            break
                        case 'page.draftData.seo.imageUrl':
                            $scope.page.draftData.seo.imageUrl = image.url
                            break
                        case 'page.draftData.heroSection.backgroundImageUrl':
                            $scope.page.draftData.heroSection.backgroundImageUrl = image.url
                            break
                        case 'page.draftData.heroSection.profileImageUrl':
                            $scope.page.draftData.heroSection.profileImageUrl = image.url
                            break
                        case 'page.draftData.aboutSection.profileImageUrl':
                            $scope.page.draftData.aboutSection.profileImageUrl = image.url
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

        // using array
        $scope.gradients = getGradients()

        $scope.setBackgroundGradient = (gradient) => {
            // linear gradient to right (default)
            // return gradient.css();
            return $scope.draftData.heroSection.backgroundGradient = gradient
        }
    })

    function getGradients() {
        return [
            { key: 'red', css: 'linear-gradient(135deg, rgba(222, 0, 63, 0.8), rgba(235, 74, 0, 0.8))' },
            { key: 'orange', css: 'linear-gradient(135deg, rgba(235, 74, 0, 0.8), rgba(241, 196, 15, 0.8))' },
            { key: 'yellow', css: 'linear-gradient(135deg, rgba(241, 196, 15, 0.8), rgba(243, 156, 18, 0.8))' },
            { key: 'green', css: 'linear-gradient(135deg, rgba(0, 222, 96, .8), rgba(0, 188, 235, .8))' },
            { key: 'blue', css: 'linear-gradient(135deg, rgba(1, 54, 189, 0.8), rgba(28, 70, 177, 0.7))' },
            { key: 'purple', css: 'linear-gradient(135deg, rgba(142, 68, 173, 0.8), rgba(131, 0, 185, 0.8))' },
            { key: 'pink', css: 'linear-gradient(135deg, rgba(253, 6, 234, 0.8), rgba(224, 40, 92, 0.8))' },
            { key: 'purpleBlue', css: 'linear-gradient(135deg, rgba(148, 0, 222, 0.8), rgba(0, 176, 235, 0.8))' },
            { key: 'white', css: 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5))' },   
            { key: 'black', css: 'linear-gradient(135deg, rgba(32, 28, 28, 1), rgba(0, 0, 0, 0.5))' },   
        ]
    }

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
        ensureField(draftData.heroSection, 'profileImageUrl', user.imageUrl)
        ensureBoolField(draftData.heroSection, 'showProfileImage',  false)
        ensureField(draftData.heroSection, 'backgroundImageUrl', '/vendor_node/smedian-pages/templates/user/t1/v1_0/page/images/mountain.jpg')
        ensureField(draftData.heroSection, 'backgroundColor', '1abc9c')
        ensureField(draftData.heroSection, 'textColor', 'ffffff')
        //featured stories button
        ensureField(draftData.heroSection, 'featuredStoriesButton', {})
        ensureField(draftData.heroSection.featuredStoriesButton, 'backgroundColor', 'transparent')
        ensureField(draftData.heroSection.featuredStoriesButton, 'backgroundGradient', getGradients()[0])
        ensureField(draftData.heroSection.featuredStoriesButton, 'textColor', 'ffffff')
        ensureField(draftData.heroSection.featuredStoriesButton, 'text', 'Featured Stories')
        ensureField(draftData.heroSection.featuredStoriesButton, 'show', true)
        //hire button
        ensureField(draftData.heroSection, 'contactButton', {})
        ensureField(draftData.heroSection.contactButton, 'backgroundColor', 'transparent')
        ensureField(draftData.heroSection.contactButton, 'borderColor', 'ffffff')
        ensureField(draftData.heroSection.contactButton, 'textColor', 'ffffff')
        ensureField(draftData.heroSection.contactButton, 'text', 'Hire Me')
        ensureField(draftData.heroSection.contactButton, 'show', true)
        //newsletter button
        ensureField(draftData.heroSection, 'newsletterButton', {})
        ensureField(draftData.heroSection.newsletterButton, 'backgroundColor', 'transparent')
        ensureField(draftData.heroSection.newsletterButton, 'borderColor', 'ffffff')
        ensureField(draftData.heroSection.newsletterButton, 'textColor', 'ffffff')
        ensureField(draftData.heroSection.newsletterButton, 'text', 'Get My Newsletter')
        ensureField(draftData.heroSection.newsletterButton, 'show', true)
        
        //--About Us section
        ensureBoolField(draftData, 'showAboutSection', true)
        ensureField(draftData, 'aboutSection', {})
        ensureField(draftData.aboutSection, 'description', user.description)
        ensureField(draftData.aboutSection, 'profileImageUrl', user.imageUrl)
        ensureBoolField(draftData.aboutSection, 'showProfileImage',  StringUtils.isValidUrl(user.imageUrl))
        ensureBoolField(draftData.aboutSection, 'showSkills', true)
        ensureArrayFieldNotEmpty(draftData.aboutSection, 'skills', {
            name: 'Writing',
            description: '',
            levelOutOf100Pct: 50
        })

        ensureField(draftData, 'navigationBarLogo', {})
        ensureField(draftData.navigationBarLogo, 'text', user.name || user.username)
        ensureBoolField(draftData.navigationBarLogo, 'includeText', false)
        //--Social Links Section
        ensureSocialLinks()

        //--Featured Stories Section
        ensureField(draftData, 'featuredStoriesSection', {})
        ensureField(draftData.featuredStoriesSection, 'title', 'Featured Stories')
        ensureField(draftData.featuredStoriesSection, 'description', '')
        ensureArrayFieldNotEmpty(draftData.featuredStoriesSection, 'stories')

        //--Newsletter Form
        ensureBoolField(draftData, 'showNewsletterForm', false)
        ensureField(draftData, 'newsletterForm', {})
        ensureField(draftData.newsletterForm, 'title', 'Get My Newsletters')
        ensureField(draftData.newsletterForm, 'description', '')
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
        ensureField(draftData.contactForm, 'title', 'Contact Me')
        ensureField(draftData.contactForm, 'description', '')
        ensureField(draftData.contactForm, 'recipientEmail', '')
        ensureField(draftData.contactForm, 'successTitle', 'Thanks for Signup Up')
        ensureField(draftData.contactForm, 'successText', 'You will hear from us soon!')
        ensureField(draftData.contactForm, 'successImageUrl', '')
        ensureField(draftData.contactForm, 'successCTAUrl', '')
        ensureField(draftData.contactForm, 'successCTAText', '')
        ensureField(draftData.contactForm, 'submitButton', {})
        ensureField(draftData.contactForm.submitButton, 'backgroundColor', '1abc9c')
        ensureField(draftData.contactForm, 'subjectFieldPlaceholder', 'Subject')
        ensureField(draftData.contactForm, 'messageFieldPlaceholder', '')
        ensureBoolField(draftData.contactForm, 'includeSubjectField', false)

        //Footer Links
        ensureField(draftData, 'footerSection', {})
        ensureField(draftData.footerSection, 'title', user.name || user.username)
        ensureField(draftData.footerSection, 'backgroundImageUrl', '')
        ensureField(draftData.footerSection, 'backgroundColor', '1abc9c')
        ensureField(draftData.footerSection, 'backgroundGradient', '1abc9c')
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
angularApp
	.controller('AppCtrl', function AppCtrl($scope, $sce, $window, $location, $timeout, SocketIO, Medium, PagesService, PageService, Publications, EmailService) {
        _SocketIO = SocketIO

        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        const ssrCData = SmedianPages.getSsrCData()
        const ssrCDataPage = ssrCData.page.previewPage || ssrCData.page.publishedPage
        if(ssrCData.page.publishedPage) {
            $scope.isPreviewPage = false
        } else {
            $scope.isPreviewPage = true
        }

        $scope.page = ssrCDataPage.page
        $scope.pageId = $scope.page.id
        $scope.templateData = ssrCDataPage.templateData
        $scope.ij = ssrCDataPage.ij
        
        $scope.user = $scope.page.masterObject
        $scope.currentUser = SmedianPages.CurrentUser.get();

        $scope.smedianPageComponentActionsMenu = new SmedianPages.component.ActionsMenu({
            page: ssrCData.page,
            getCurrentUser: () => SmedianPages.CurrentUser.get(),
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

        function isUrlValid(url, inDomain) {
            if(!url) return false
            var re = /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            const urlParts = url.trim().split(".")
            return re.test(url) && urlParts.length > 1 && urlParts[1].length && urlParts[urlParts.length - 1].length
                && (!inDomain || (inDomain && url.toLowerCase().contains(inDomain.toLowerCase())))
        }
        $scope.isUrlValid = isUrlValid

        $scope.loginMediumer = () => {
            Medium.getAuthUrl(preLoginData)
        }

        //--Newsletter Signup
        $scope.newNewsletterSignup = {
            email: $scope.currentUser && $scope.currentUser.email || '', 
            name: $scope.currentUser && $scope.currentUser.name || '', 
        }

        $scope.submitNewsletterSignup = () => {
            const email = $scope.newNewsletterSignup.email
            $scope.newNewsletterSignup.sendingSubmission = true
            EmailService.submitUserNewsletterSignup($scope.user.id, email, $scope.newNewsletterSignup.name)
                .then((result) => {
                    debugger
                    $scope.newNewsletterSignup.sendingSubmission = false
                    $scope.newNewsletterSignup.lastSentEmail = email
                }, (err) => {
                    $scope.newNewsletterSignup.errorMessage = 'Could not send your submission. Please try again.'
                    $scope.newNewsletterSignup.sendingSubmission = false
                    debugger
                })
        }

        $scope.newContactFormSubmission = {
            from: $scope.currentUser && $scope.currentUser.email || ''
        }
        $scope.sendContactFormSubmission = () => {
            const submission = $scope.newContactFormSubmission
            $scope.newContactFormSubmission = {}
            $scope.newContactFormSubmission.sendingSubmission = true
            PagesService.sendContactFormSubmission($scope.pageId, submission)
                .then((result) => {
                    debugger
                    $scope.newContactFormSubmission.sendingSubmission = false
                    $scope.newContactFormSubmission.sentEmail = true
                }, (err) => {
                    NProgress.done()
                    debugger
                    $scope.newContactFormSubmission = submission
                    $scope.newContactFormSubmission.errorMessage = 'Could not send your message. Please try again.'
                    $scope.newContactFormSubmission.sendingSubmission = false
                })
        }

        
        setTimeout(() => {
            $('#iframe-google-form').attr('src', $sce.trustAsResourceUrl($scope.templateData.requestToContributeForm.externalFormUrl))
        }, 10)

        $scope.scrollToFeaturedStoriesSection = () => {
            $('html,body').animate({
                scrollTop: $("#featured-stories-section").offset().top - 35
            });
        }

        $scope.scrollToContactForm = () => {
            $('html,body').animate({
                scrollTop: $("#contact-form-section").offset().top - 35
            });
        }

        $scope.scrollToNewsletterForm = () => {
            $('html,body').animate({
                scrollTop: $("#newsletter-form-section").offset().top - 35
            });
        }

        $scope.trustAsHtml = (html) => {
            return $sce.trustAsHtml(html)
        }

        setTimeout(() => {
            $('.js-projectLink').mouseover(function(){
                $(this).children('.js-projectWrapper').css('background-color', '#333')
            })
            $('.js-projectLink').mouseout(function(){
                $(this).children('.js-projectWrapper').css('background-color', 'initial')
            });

            $('.js-contactFormInput').focusin(function(){
                var colorHex = '#f1c40f'
                try {
                    colorHex = $scope.templateData.contactForm.submitButton.backgroundColor.replace('#','')
                } catch(err) {}
                $(this).css('box-shadow', 'inset 2px 0 0 0 #' + colorHex)
            })
            $('.js-contactFormInput').focusout(function(){
                $(this).css('box-shadow', 'initial')
            });

            $('.js-newsletterFormInput').focusin(function(){
                var colorHex = '#f1c40f'
                try {
                    colorHex = $scope.templateData.newsletterForm.submitButton.backgroundColor.replace('#','')
                } catch(err) {}
                $(this).css('box-shadow', 'inset 2px 0 0 0 #' + colorHex)
            })
            $('.js-newsletterFormInput').focusout(function(){
                $(this).css('box-shadow', 'initial')
            });
        }, 500)

        $scope.socialLinkImagePaths = {
            medium: 'images/medium.png',
            twitter: 'images/twitter-icon_black.svg',
            linkedin: 'images/linkedin.svg',
            facebook: 'images/facebook-icon_black.svg',
            instagram: 'images/instagram-icon-black.svg',
            dribbble: 'images/dribbble-icon-black.svg',
            behance: 'images/behance-icon-black.svg',
            github: 'images/github.svg'
        }
    })
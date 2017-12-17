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
        
        $scope.pub = $scope.page.masterObject
        $scope.currentUser = SmedianPages.CurrentUser.get();

        $scope.smedianPageComponentActionsMenu = new SmedianPages.component.ActionsMenu({
            page: (ssrCData.page.previewPage || ssrCData.page.publishedPage).page,
            getCurrentUser: () => SmedianPages.CurrentUser.get(),
        })

        $scope.getWindowWidth = () => {
            try {
                const v = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
                debugger
                return v
            } catch(err){}
        }

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
            Medium.getAuthUrl()
        }


        //--Request to Contribute
        $scope.addNewRequestToContributeSupportingLink = () => {
            $scope.ij.newRequestToContributeData.supportingLinks.push({})
        }
        
        
        $scope.sendPubContributeRequest = function() {
            var pub = $scope.pub
            if(!CurrentUser.get()) {
                //the user isn't logged in. send it to log in with Medium.com's auth
                $scope.loginMediumer();
                return
            }
            pub.sendingRequestToContribute = true;
            
            Publications.toggleRequestToContribute(pub.id, true, $scope.ij.newRequestToContributeData)
                .then(function(response){
                    pub.sendingRequestToContribute = false
                    pub.sentRequestToContribute = true
                    if(!response) return
                    if(response.status == 200 || response.status == 201) {
                        $scope.pub.currentUserContributeRequest = response.data
                        pub.currentUserRequestedToContribute = true;
                        pub.requestToContributeActionStatus = "";
                    } else if(response.status == 429) {
                        $scope.userAlreadySentMaxRequestToContributeThisWeek = true;
                        console.log("Current user has made too many requests to contribute to pubs this week.");
                        $("#show-user-reached-max-weekly-requests-to-contribute-modal").click();
                    } else {
                        pub.failedToSendRequestToContribute = true
                    }
                }, function(response){
                    debugger
                    pub.failedToSendRequestToContribute = true
                    pub.sendingRequestToContribute = false;
                });
        }

        $scope.sendPubContributeRequestSupportingLink = function(pub,url) {
            var pub = $scope.pub
            Publications.sendContributeRequestSupportingLink(pub.id, url)
                .then((supportingLink) => {
                    debugger
                    try {
                        if(!pub.currentUserContributeRequest.supportingLinks) pub.currentUserContributeRequest.supportingLinks = []
                        for(var i = 0; i < pub.currentUserContributeRequest.supportingLinks.length; i++){
                            if(pub.currentUserContributeRequest.supportingLinks[i].id == supportingLink.id) {
                                return
                            }
                        }
                        $timeout(() => {
                            pub.currentUserContributeRequest.supportingLinks.push(supportingLink);
                        })
                    } catch(err) {
                        console.error('$scope.sendPubContributeRequestSupportingLink', err.messege)
                    }
                }, (response) => {
                    debugger
                    console.log("Error occurred trying to request supporting link: " + JSON.stringify(response));
                });
        }
        $scope.retractPubContributeRequestSupportingLink = function(supportingLinkId) {
            const pub = $scope.pub
            debugger
            Publications.deleteContributeRequestSupportingLinkById(pub.id, supportingLinkId);
            for(var i = 0; i < pub.currentUserContributeRequest.supportingLinks.length; i++){
                if(pub.currentUserContributeRequest.supportingLinks[i].id == supportingLinkId) {
                    pub.currentUserContributeRequest.supportingLinks.remove(i);
                }
            }
        }
        //--/Request to Contribute

        //--Newsletter Signup
        $scope.newNewsletterSignup = {
            email: $scope.currentUser && $scope.currentUser.email || '', 
            name: $scope.currentUser && $scope.currentUser.name || '', 
        }
        $scope.submitNewsletterSignup = () => {
            const email = $scope.newNewsletterSignup.email
            $scope.newNewsletterSignup.sendingSubmission = true
            EmailService.submitPubNewsletterSignup($scope.pub.id, email, $scope.newNewsletterSignup.name)
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

        $scope.scrollToRequestToContribute = () => {
            $('html,body').animate({
                scrollTop: $("#rtc-form-section").offset().top
            });
        }

        $scope.scrollToNewsletterForm = () => {
            $('html,body').animate({
                scrollTop: $("#newsletter-form-section").offset().top
            });
        }

        $scope.trustAsHtml = (html) => {
            return $sce.trustAsHtml(html)
        }

        try {
            $('#ssr-view-rmwr').remove()
        } catch(err) {}
    })
angularApp
    .controller('HomeController', function HomeController($scope) {
        $scope.currentView = 'home'

        $scope.showHomeSection = () => {
            $scope.setCurrentView('home')
        }

        $scope.showAboutSection = () => {
            $scope.setCurrentView('about')
        }

        $scope.showFeaturedStoriesSection = () => {
            $scope.setCurrentView('featuredStories')
        }

        $scope.showContactSection = () => {
            $scope.setCurrentView('contact')
        }

        $scope.showNewsletterSection = () => {
            $scope.setCurrentView('newsletter')
        }

        $scope.setCurrentView = (view) => {
            $scope.currentView = view
        }
    })
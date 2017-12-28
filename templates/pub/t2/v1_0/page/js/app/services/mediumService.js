angularApp
	.service("Medium", function($http, $location) {
        var functions = {};
        this.getAuthUrl = function() {
            var endpoint = "/api/i/user/auth/login/medium/url"
            endpoint += "?apiKey=p8q937b32y2ef8sdyg"
            return $http.get(endpoint).
                then(function(response) { 
                    window.location.href = response.data
                }, function(response) {
                    console.log("Error retrieving Medium authtentication url: " + JSON.stringify(response));
                });
        }
        this.exchangeAuthCodeForAccessToken = function(authCode) {
            var endpoint = "api/i/user/auth/login/medium/exchange/" + authCode
            endpoint += "?apiKey=p8q937b32y2ef8sdyg"
            debugger
            return $http.get(endpoint)
                .then(function(response) {
                    //success
                    //console.log(JSON.stringify(response));
                    return response;
                }, function(response){
                    console.log("Error exchanging Medium auth code for token: " + JSON.stringify(response));
                    if(response) {
                        var responseData = response.data;
                        alert(JSON.stringify(response))
                        if(responseData) {
                            var responseError = responseData.error;
                            if(responseError && responseError.contains("An access token is required")) {
                                alert("Your authcode is expired. Please try to log in with medium again.");
                                //send the user back home to try again because we need the tokens for the app to work
                                window.location = "/";
                            }
                        }
                    }
                    return response;
                })
        }

        functions.getAuthUrl = this.getAuthUrl;
    })
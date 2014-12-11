/// <reference path="../services/office365/scripts/utility.js" />
/// <reference path="../services/office365/scripts/o365adal.js" />
/// <reference path="../services/office365/scripts/exchange.js" />

(function () {
    'use strict';
    angular.module('app365').factory('app365api', [app365api]);

    function app365api() {

        var authContext;
        var authtoken;
        var outlookClient;
        var userName;

        // Login to O365
        function login(callback) {
            if (!authContext) {
                authContext = new O365Auth.Context();
            }

            authContext.getIdToken("https://outlook.office365.com/")
           .then((function (token) {
               // Get auth token
               authtoken = token;
               // Get user name from token object.
               userName = token.givenName + " " + token.familyName;
               // Create Outlook client object.
               outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
               // Callback without parameter to indicate successful sign-in.
               callback();
           }).bind(this), function (reason) {
               // Log sign-in error message.
               console.log('Failed to login. Error = ' + reason.message);
               callback(reason.message);
           });
        };

        // Logout
        function logout() {
            if (!authContext) {
                authContext = new O365Auth.Context();
            }

            authContext.logOut();
        };

        // Get signed-in user name.
        function getUserName() {
            return userName;
        };

        return {
            login: login,
            logout: logout,
            getUserName: getUserName,
            outlookClientObj: function () { return outlookClient; }
        };
    };
})();
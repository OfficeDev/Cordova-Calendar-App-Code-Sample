(function () {
    'use strict';

    angular.module('app365').controller('signOutCtrl', ['$scope', '$state', 'app365api', signOutCtrl]);

    function signOutCtrl($scope, $state, app365api) {
        var vm = this;
        vm.signout = function () {
            // Logout and navigate to sign-in page.
            app365api.logout();
            $state.go('sign-in');
        }

        vm.signout();
    }
})();
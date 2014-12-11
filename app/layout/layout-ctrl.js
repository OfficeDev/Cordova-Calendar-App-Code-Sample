(function () {
    'use strict';

    angular.module('app365').controller('layoutCtrl', ['$scope', 'app365api', layoutCtrl]);

    function layoutCtrl($scope, app365api) {
        var vm = this;

        vm.getusername = function () {
            // Get signed-in user name.
            vm.userName = app365api.getUserName();
        };

        vm.getusername();
    }
})();
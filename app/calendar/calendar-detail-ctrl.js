/// <reference path="../../services/office365/scripts/utility.js" />
/// <reference path="../../services/office365/scripts/o365adal.js" />
/// <reference path="../../services/office365/scripts/exchange.js" />

(function () {
    'use strict';

    angular.module('app365').controller('calendarDetailCtrl', ['$scope', '$stateParams', '$location', 'app365api', calendarDetailCtrl]);

    function calendarDetailCtrl($scope, $stateParams, $location, app365api) {
        var vm = this;
        // Get event with specified event id.
        vm.getEvent = function () {
            var outlookClient = app365api.outlookClientObj();
            NProgress.start();
            outlookClient.me.calendar.events.getEvent($stateParams.id).fetch()
            .then(function (event) {
                // Get event detail like subject, location, attendees etc.
                vm.subject = event.subject;
                vm.start = event.start;
                vm.end = event.end;
                vm.bodypreview = event.bodyPreview;
                vm.location = event.location.displayName;
                var attendees;
                event.attendees.forEach(function (attendee) {
                    if (typeof attendees == 'undefined') {
                        attendees = attendee.emailAddress.name
                    } else {
                        attendees += "," + attendee.emailAddress.name;
                    }                    
                });

                vm.attendees = attendees;
                $scope.$apply();
                NProgress.done();
            });
        };      

        vm.getEvent();
    }
})();
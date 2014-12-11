(function () {
    'use strict';

    angular.module('app365').controller('calendarCtrl', ['$scope', '$stateParams', '$ionicLoading', '$ionicPopup', 'app365api', calendarCtrl]);

    function calendarCtrl($scope, $stateParams, $ionicLoading, $ionicPopup, app365api) {
        var vm = this;
        var outlookClient;

        // Get events.
        function getEvents() {
            var filterQuery;

            // Get today's date with time parts set to 00.
            var d = new Date();
            var today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get tomorrow's date with time parts set to 00.
            d.setDate(d.getDate() + 1);
            var tomorrow = d;
            tomorrow.setHours(0, 0, 0, 0);

            // Get day after tomorrow date with time parts set to 00.
            var dd = new Date();
            dd.setDate(dd.getDate() + 2);
            var tommorrowNext = dd;
            tommorrowNext.setHours(0, 0, 0, 0);

            // Filter to get Today's event.
            if (typeof $stateParams.today != 'undefined') {               
                filterQuery = 'start gt ' + today.toISOString() + ' and start lt ' + tomorrow.toISOString();
            }

            // Filter to get Tomorrow's event.
            if (typeof $stateParams.tomorrow != 'undefined') {
                filterQuery = 'start gt ' + tomorrow.toISOString() + ' and start lt ' + tommorrowNext.toISOString();
            }

            // Filter to get all event greater than today.
            if (typeof $stateParams.all != 'undefined') {
                filterQuery = 'start gt ' + today.toISOString();
            }

            NProgress.start();
            // Get events with filter.
            outlookClient.me.calendar.events.getEvents().filter(filterQuery).fetch()
            .then(function (events) {
                // Get current page. Use getNextPage() to fetch next set of events.
                vm.events = events.currentPage;
                $scope.$apply();
                NProgress.done();
            });            
        };       

        // Delete event
        $scope.deleteEvent = function (event) {
            // Ionic pop-up to confirm delete action.
            var confirmPopup = $ionicPopup.confirm({
                title: 'Calendar App',
                template: 'Are you sure you want to delete the event?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    // Fetch event with specified event id.
                    outlookClient.me.calendar.events.getEvent(event.id).fetch()
                    .then(function (event) {
                        // Delete event.
                        event.delete()
                        .then((function (response) {
                            $ionicLoading.show({ template: 'Event deleted successfully !!', noBackdrop: true, duration: 1000 });
                            // Refresh event list.
                            getEvents();
                        }).bind(this), function (reason) {
                            // Log delete event error.
                            console.log('Fail to delete event. Error = ' + reason.message);
                            $ionicLoading.show({
                                template: 'Failed to delete event. Error: ' + reason.message
                                , noBackdrop: true, duration: 1500
                            });
                        });
                    });
                } else {
                    // do nothing when user cancel on delete confirmation dialog.                     
                }
            });
        };

        vm.loadList = function () {
            // Get Outlook client object.
            outlookClient = app365api.outlookClientObj();
            getEvents();

        };

        vm.loadList();
    }
})();
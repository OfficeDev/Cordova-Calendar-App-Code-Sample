## Cordova Calendar Client App

This sample app shows step by step how to create a Cordova app using Ionic framework and O365 Outlook services from scratch.

It is highly recommended to go through [Visual Studio Tools for Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) and [Getting Started with Visual Studio Tools for Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) to setup Cordova development environment.

In this tutorial, you'll these steps

1. Create Blank Codrova using Visual Studio
2. Add Ionic framework
3. Add O365 services to app
4. Set permissions to O365 calendar tenet to grant appropiate access to app
5. Create app folder structure, UI routing and layout using Ionic controls and navigation
6. Acquire an access token and get the Outlook services client using AngularJS factory
7. Use O365 API to fetch a.) Today's meeting (event start date equals today), b.) Tomorrow's meeting (event start date equals tomorrow) and c.) All events with start date greater or equal to today
8. Use O365 API to delete event
9. Use O365 API to add new event
10. Run the app!

![Application login page](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Application calendar view](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calandar-list.png)
![Application calendar event detail page](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-event.png)

### Step 1: Create Blank Codrova using Visual Studio
Create a new Cordova project in Visual Studio by choosing File --> New project --> JavaScript --> Apache Cordova Apps --> Blank App template. This sample uses JavaScript code, but you can also write your Cordova app in TypeScript.

### Step 2: Add Ionic framework
1.	From the Ionic framework website, choose Download beta.
2.	Extract the zip
3.	Create new folder named lib under Cordova project in Visual Studio solution explorer and copy the extracted content under lib folder.

![Folder structure for project](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**Update the script references**
- In index.html, add the following Ionic references in the ``` <head> ``` element, after the Cordova and platformOverrides script references.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- In index.html, add following ionic css reference.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Step 3: Add O365 services to app
Refer [Set up your Office 365 development environment](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) documentation on Signing up for an Office 365 Developer Site and Set up Azure Active Directory access for your Developer Site.

Follow these steps to add and configure Office 365 APIs by using the Services Manager in Visual Studio.

1. Download and install the Office 365 API tools from the Visual Studio Gallery
2. On the project node, right click and choose **Add --> Connected Service**
3. At the top of the Services Manager dialog box, choose the Office 365 link, and then choose Register your app. Sign in with a tenant administrator account for your Office 365 developer organization.
![O365 Services Manager dialog sign in](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Step 4: Set permissions to O365 calendar tenet to grant appropiate access to app
Select Calendar and click on Permissions... link on right pane and then select 'have full access to users' calendar'. Similarly if you want to give only read access to app, select 'Read users' calendar'.

![O365 permission scopes for calendar dialog](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-permission.png)

Click Apply and Ok to set the permission and add O365 API to project. This will add Service folder containing JavaScript libraries to the project.

![project folder tree after adding permissions](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

In index.html, add the following O365 references in the ``` <head> ``` element.
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Step 5: Create app folder structure, UI routing and layout using Ionic controls and navigation**

1. Create app folder under project root node. app folder will contain files specific to app. Each UI component which does fetching and binding the data to UI will have corresponding controller much like UI and code behind pattern. For example calendar-list.html will show list control to display user events and calendar-list-ctrl.js will contain code to fetch users events using O365 API.

![project folder tree structure for application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-app-folder.PNG)

**Folder and file detail:**
- **auth** contains UI and code for signing-in and sign-out
- **layout** contains UI to display app content and navigation like ion-pane, ion-side-menus, ion-nav-bar and code to bind the user name.
- **app.js** contains ui routing to navigate to different pages
- **service-o365.js** contains utility function to get access token, create Outlook services client object, signout and get user name. This is implemented as Angular factory so that these functions can be exposed as utility function across different pages.

**app.js defining ui routing**
```javascript
angular.module("app365", ["ionic"])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    // Layout page.
    .state('app', {
        abstract: true,
        url: "/app",
        templateUrl: "app/layout/layout.html"
    })

    // Sign-in page.
     .state('sign-in', {
         url: "/sign-in",
         templateUrl: "app/auth/sign-in.html"
     })

    // Sign-out page.
        .state('app.sign-out', {
            url: "/sign-out",
            views: {
                'mainContent': {
                    templateUrl: "app/auth/sign-out.html"
                }
            }
        })

    // Add new event page.
    .state('app.newEvent', {
        url: "/newevent",
        views: {
            'mainContent': {
                templateUrl: "app/calendar/add-event.html"
            }
        }
    })

    // Event list page.
    .state('app.calendar', {
        url: "/calendar",
        views: {
            'mainContent': {
                templateUrl: "app/calendar/calendar-tab.html"
            }
        }
    })

    // List of today's event page.
    .state('app.calendar.today', {
        url: "/today/id:today",
        views: {
            "tab-today-calendar": {
                templateUrl: "app/calendar/calendar-list.html"
            }
        }
    })

    // Event detail page.
    .state('app.calendar-detail', {
        url: "/calendar/:id",
        views: {
            'mainContent': {
                templateUrl: "app/calendar/calendar-detail.html"
            }
        }
    })

    // List of tomorrow's event page.
    .state('app.calendar.tomorrow', {
        url: "/tomorrow/id:tomorrow",
        views: {
            "tab-tomorrow-calendar": {
                templateUrl: "app/calendar/calendar-list.html"
            }
        }
    })

     // All events list page.
    .state('app.calendar.all', {
        url: "/all/id:all",
        views: {
            "tab-all-calendar": {
                templateUrl: "app/calendar/calendar-list.html"
            }
        }
    });

    // Navigate to sign-in page when app starts.
    $urlRouterProvider.otherwise('sign-in');
})
```
**App layout (menu, nav-bar)**
```html
<ion-side-menus ng-controller="layoutCtrl as vm">
    <ion-pane ion-side-menu-content>
        <ion-nav-bar class="bar-positive">
            <ion-nav-back-button class="button-clear icon ion-ios7-arrow-back"></ion-nav-back-button>
            <button menu-toggle="left" class="button button-icon icon ion-navicon"></button>
        </ion-nav-bar>
        <ion-nav-view name="mainContent" animation="slide-left-right"></ion-nav-view>
    </ion-pane>

    <ion-side-menu side="left">
        <header class="bar bar-header bar-positive">
            <h1 class="title">{{vm.userName}}</h1>
        </header>
        <ion-content class="has-header">
            <ion-list>
                <ion-item nav-clear menu-close ui-sref="app.calendar">Home</ion-item> 
                <ion-item nav-clear menu-close ui-sref="app.newEvent">New Event</ion-item>                          
                <ion-item nav-clear menu-close ui-sref="app.sign-out">Sign-out</ion-item>
            </ion-list>
    </ion-side-menu>
</ion-side-menus>
```
**Create Calendar tab page to show today's, tomorrow's and all events under different tabs**
```html
<ion-view>
    <ion-tabs class="tabs-positive tabs-icon-top">
        <ion-tab title="Today" icon="ion-star" ui-sref="app.calendar.today">
            <ion-nav-view name="tab-today-calendar"></ion-nav-view>
        </ion-tab>

        <ion-tab title="Tomorrow" icon="ion-ios7-email-outline" ui-sref="app.calendar.tomorrow">
            <ion-nav-view name="tab-tomorrow-calendar"></ion-nav-view>
        </ion-tab>

        <ion-tab title="All" icon="ion-email" ui-sref="app.calendar.all">
            <ion-nav-view name="tab-all-calendar"></ion-nav-view>
        </ion-tab>
    </ion-tabs>
</ion-view>
```

### Step 6: Acquire an access token and get the Outlook services client using AngularJS factory

**Acquire an access token**
```javascript
var authContext = new O365Auth.Context();
authContext.getIdToken("https://outlook.office365.com/")
.then((function (token) {
     // Get auth token
     authtoken = token;
     // Get user name from token object.
     userName = token.givenName + " " + token.familyName;
    }), function (error) {
      // Log sign-in error message.
      console.log('Failed to login. Error = ' + error.message);
 });
```
**create Outlook services client object**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### Step 7: Use O365 API to fetch a.) Today's meeting (event start date equals today), b.) Tomorrow's meeting (event start date equals tomorrow) and c.) All events with start date greater or equal to today

**a. Fetch today's meeting (event start date equals today)**
```javascript
// Get today's date with time parts set to 00.
var d = new Date();
var today = new Date();
today.setHours(0, 0, 0, 0);       
var filterQuery = 'start gt ' + today.toISOString() + ' and start lt ' + tomorrow.toISOString();           
           
// Get events with filter.
outlookClient.me.calendar.events.getEvents().filter(filterQuery).fetch()
.then(function (events) {
   // Get current page. Use getNextPage() to fetch next set of events.
   vm.events = events.currentPage;
   $scope.$apply();               
}); 
```

**b. Fetch tomorrow's meeting (event start date equals tomorrow)**
```javascript
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

var filterQuery = 'start gt ' + tomorrow.toISOString() + ' and start lt ' + tommorrowNext.toISOString();          
           
// Get events with filter.
outlookClient.me.calendar.events.getEvents().filter(filterQuery).fetch()
.then(function (events) {
   // Get current page. Use getNextPage() to fetch next set of events.
   vm.events = events.currentPage;
   $scope.$apply();               
}); 
```
**c. Fetch all events with start date greater or equal to today**
```javascript
var d = new Date();
var today = new Date();
today.setHours(0, 0, 0, 0);

var filterQuery = 'start gt ' + today.toISOString(); 
// Get events with filter.
outlookClient.me.calendar.events.getEvents().filter(filterQuery).fetch()
.then(function (events) {
   // Get current page. Use getNextPage() to fetch next set of events.
   vm.events = events.currentPage;
   $scope.$apply();               
}); 
```

### Step 8: Use O365 API to delete event
Outlook client object can be used to delete event, first get the event which you want to delete using event id and then call delete() on event object to delete the particular event.
```javascript
 // Fetch event with specified event id.
outlookClient.me.calendar.events.getEvent(event.id).fetch()
.then(function (event) {
    // Delete event.
    event.delete()
    .then((function (response) {
         console.log('event deleted successfully.');
     }).bind(this), function (reason) {         
          console.log('Fail to delete event. Error = ' + reason.message);
     });
});
```

### Step 9: Use O365 API to add new event
Outlook client object can be used to add, update and delete event.

**Create the page to submit the data for creating new event**
```html
<ion-view title=" New Event" ng-controller="newEventCtrl as vm">
    <ion-content class="has-header">
        <div class="list">
            <label class="item item-input">              
                <input type="email" placeholder="To" ng-model="newEvent.toRecipients">
            </label>
            <label class="item item-input">               
                <input type="text" placeholder="Subject" ng-model="newEvent.subject" />
            </label>
            <label class="item item-input">               
                <input type="datetime" placeholder="Start Date & Time [YYYY-MM-DD HH:MM:SS]" ng-model="newEvent.start" />
            </label>
             <label class="item item-input ">              
                 <input type="datetime" placeholder="End Date & Time [YYYY-MM-DD HH:MM:SS]" ng-model="newEvent.end" />
            </label>
        </div>
        <div>
            <textarea class="item item-input" placeholder="Event body text" style="height:200px;background-color:#FBFBEF" ng-model="newEvent.body"></textarea>
        </div>
        <div class="padding">
            <button class="button button-block button-positive" ng-click="addEvent()">
                Add Event
            </button>
        </div>
    </ion-content>
</ion-view>
```

**Use following code to create new event**
```javascript
(function () {
    'use strict';

    angular.module('app365').controller('newEventCtrl', ['$scope', '$state', '$ionicLoading', 'app365api', newEventCtrl]);

    function newEventCtrl($scope, $state, $ionicLoading, app365api) {
        var vm = this;
        var outlookClient;
        $scope.newEvent = {};

        // Add event
        $scope.addEvent = function () {
            // Get Outlook client object.
            outlookClient = app365api.outlookClientObj();
            // Event body content
            var eventBody = new Microsoft.OutlookServices.ItemBody();
            eventBody.contentType = Microsoft.OutlookServices.BodyType.HTML;
            eventBody.content = $scope.newEvent.body;           
            // Event attendee.
            var attendee = new Microsoft.OutlookServices.Attendee();
            // Attendee email address.
            var emailAddress = new Microsoft.OutlookServices.EmailAddress();           
            emailAddress.address = $scope.newEvent.toRecipients;
            attendee.emailAddress = emailAddress;
            // Event object.
            var event = new Microsoft.OutlookServices.Event();
            // Event start date.
            event.start = new Date($scope.newEvent.start).toISOString();
            // Event end date time
            event.end = new Date($scope.newEvent.end).toISOString();
            // Event subject.
            event.subject = $scope.newEvent.subject;
            // Event body.
            event.body = eventBody;
            // Add event attendee.
            event.attendees.push(attendee);
            // Event location.
            event.location = new Microsoft.OutlookServices.Location();
            event.location.displayName = 'Sample Location';
            // Add event
            outlookClient.me.calendar.events.addEvent(event)
            .then((function (response) {
                $ionicLoading.show({ template: 'Event added successfully !!', noBackdrop: true, duration: 1000 });
                // Navigate to event list after adding the event.
                $state.go('app.calendar');
            })
            .bind(this), function (reason) {
                // Log the error message encountered while adding the event.
                console.log('Fail to add event. Error = ' + reason.message);
            });
        };
    };
})();
```

### Step 10: Run the app

1. Select Android and target either as Android Emulator or device. Please note currently Ripple is not supported for O365 auth.

![target platform selection bar](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 to run the app**

Refer [Deploy and Run Your App Built with Visual Studio Tools for Apache Cordova](http://msdn.microsoft.com/en-us/library/dn757049.aspx) on more detail on running the Cordova app across different platforms.


This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

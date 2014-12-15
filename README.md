## Cordova Mail Client App

This sample app shows step by step how to create a Cordova app using Ionic framework and O365 Outlook services from scratch.

It is highly recommended to go through [Visual Studio Tools for Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) and [Getting Started with Visual Studio Tools for Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) to setup Cordova development environment.

In this tutorial, you'll these steps

1. Create Blank Codrova using Visual Studio
2. Add Ionic framework
3. Add O365 services to app
4. Set permissions to O365 mail tenet to grant appropiate access to app
5. Create app folder structure, UI routing and layout using Ionic controls and navigation
6. Acquire an access token and get the Outlook services client using AngularJS factory
7. Use O365 API to fetch a.) Mails flagged as Important, b.) Unread mails and c.) All mails
8. Use O365 API to delete mail
9. Run the app!

![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Mail-list.png)
![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Mail-delete.png)

### Step 1: Create Blank Codrova using Visual Studio
Create a new Cordova project in Visual Studio by choosing File --> New project --> JavaScript --> Apache Cordova Apps --> Blank App template. This sample uses JavaScript code, but you can also write your Cordova app in TypeScript.

### Step 2: Add Ionic framework
1.	From the Ionic framework website, choose Download beta.
2.	Extract the zip
3.	Create new folder named lib under Cordova project in Visual Studio solution explorer and copy the extracted content under lib folder.

![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

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
![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Step 4: Set permissions to O365 mail tenet to grant appropiate access to app
Select Mail and click on Permissions... link on right pane and then select read and write to user's mail as app will need to perform read and delete mail operation. Similarly if you want your app to send mail then select mail as a user option.

![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Mail-permission.png)

Click Apply and Ok to set the permission and add O365 API to project. This will add Service folder containing JavaScript libraries to the project.

![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

In index.html, add the following O365 references in the ``` <head> ``` element.
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Step 5: Create app folder structure, UI routing and layout using Ionic controls and navigation**

1. Create app folder under project root node. app folder will contain files specific to app. Each UI component which does fetching and binding the data to UI will have corresponding controller much like UI and code behind pattern. For example mail-list.html will show list control to display user mails and mail-list-ctrl.js will contain code to fetch users mail using O365 API.

![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Mail-app-folder.png)

**Folder and file detail:**
- **auth** contains UI and code for signing-in and sign-out
- **layout** contains UI to display app content and navigation like ion-pane, ion-side-menus, ion-nav-bar and code to bind the user name.
- **app.js** contains ui routing to navigate to different pages
- **service-o365.js** contains utility function to get access token, create Outlook services client object, signout and get user name. This is implemented as Angular factory so that these functions can be exposed as utility function across different pages.

**Sample app.js defining ui routing**
```javascript
// Layout page
    .state('app', {
        abstract: true,
        url: "/app",
        templateUrl: "app/layout/layout.html"
    })

    // Sign-in page
     .state('sign-in', {
         url: "/sign-in",
         templateUrl: "app/auth/sign-in.html"
     })   

    // Mail list page
    .state('app.mail', {
        url: "/mail",
        views: {
            'mainContent': {
                templateUrl: "app/mail/mail-tabs.html"
            }
        }
    })

    // Mail list containing mails flagged as important
    .state('app.mail.imp', {
        url: "/imp/id:important",
        views: {
            "tab-imp-mail": {
                templateUrl: "app/mail/mail-list.html"
            }
        }
    })

    // Mail detail page
    .state('app.mail-detail', {
        url: "/mail/:id",
        views: {
            'mainContent': {
                templateUrl: "app/mail/mail-detail.html"
            }
        }
    });   

    // Navigate to sign-in page when app starts.
    $urlRouterProvider.otherwise('sign-in');
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
                <ion-item nav-clear menu-close ui-sref="app.sign-out">Sign-out</ion-item>
            </ion-list>
    </ion-side-menu>
</ion-side-menus>
```
**Create Mail tab page to show important, unread and all mails under different tabs**
```html
<ion-view>
    <ion-tabs class="tabs-positive tabs-icon-top">
        <ion-tab title="Imp" icon="ion-star" ui-sref="app.mail.imp">
            <ion-nav-view name="tab-imp-mail"></ion-nav-view>
        </ion-tab>
        <ion-tab title="Unread" icon="ion-ios7-email-outline" ui-sref="app.mail.unread">
            <ion-nav-view name="tab-unread-mail"></ion-nav-view>
        </ion-tab>
        <ion-tab title="All" icon="ion-email" ui-sref="app.mail.all">
            <ion-nav-view name="tab-all-mail"></ion-nav-view>
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
### Step 7: Use O365 API to fetch a.) Mails flagged as Important, b.) Unread mails and c.) All mails

**Fetch all mails flagged as important**
```javascript
 function getImpMails() {          
 // Filter to fetch all important mails received after 2000-10-20
var filterQuery = "Importance eq 'High' and DateTimeReceived gt 2000-10-20";
outlookClient.me.folders.getFolder("Inbox").messages.getMessages().filter(filterQuery)
.orderBy('Importance,DateTimeReceived desc').fetch()           
 .then(function (mails) {
   // Get current page. Use getNextPage() to fetch next set of mails.
   vm.mails = mails.currentPage;
   $scope.$apply();                   
  }, function (error) {
     console.log("Error encountered while fetching mails. Error: " + error.message);
    });            
 };
```

**Fetch all unread mails**
```javascript
var filterQuery = 'IsRead eq false';
outlookClient.me.folders.getFolder("Inbox").messages.getMessages().filter(filterQuery).fetch()            
.then(function (mails) {
    // Get current page. Use getNextPage() to fetch next set of mails.
    vm.mails = mails.currentPage;
    $scope.$apply();                   
 });     
```
**Fetch all mails**
```javascript
outlookClient.me.folders.getFolder("Inbox").messages.getMessages().fetch()            
.then(function (mails) {
    // Get current page. Use getNextPage() to fetch next set of mails.
    vm.mails = mails.currentPage;
    $scope.$apply();                   
 }); 
```

### Step 8: Use O365 API to delete mail
Outlook client object can be used to delete mail, first get the mail which you want to delete using mail id and then call delete() on mail object to delete the particular mail. delete() permanently deletes the mail, to move the mail to Deleted Items, use move() function.
```javascript
 outlookClient.me.folders.getFolder("Inbox").messages.getMessage(mail.id).fetch()
 .then(function (mail) {
     // Delete the mail.
     mail.delete()
     .then((function (response) {
          console.log('Mail deleted successfully.');
      }), function (error) {                            
          console.log('Fail to delete mail. Error = ' + error.message);                            
  });
});
```

### Step 9: Run the app

1. Select Android and target either as Android Emulator or device. Please note currently Ripple is not supported for O365 auth.

![](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 to run the app**

Refer [Deploy and Run Your App Built with Visual Studio Tools for Apache Cordova](http://msdn.microsoft.com/en-us/library/dn757049.aspx) on more detail on running the Cordova app across different platforms.
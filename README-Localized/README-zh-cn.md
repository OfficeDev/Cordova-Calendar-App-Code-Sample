---
page_type: sample
products:
- office-365
- office-outlook
languages:
- javascript
extensions:
  contentType: samples
  createdDate: 12/9/2014 3:58:28 PM
---
## Cordova 日历客户端应用

此示例应用分步显示了如何使用 Ionic 框架和 O365 Outlook 服务从头开始创建 Cordova 应用。

若要设置 Cordova 开发环境，强烈建议查看 [Visual Studio Tools for Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) 和 [Visual Studio Tools for Apache Cordova 入门](http://msdn.microsoft.com/en-us/library/dn771545.aspx)。

在本教程中，你将执行以下步骤

1. 使用 Visual Studio 创建空白的 Codrova
2. 添加 Ionic 框架
3. 向应用添加 O365 服务
4. 设置 O365 日历 tenet 的权限，以授予对应用的适当访问权限
5. 使用 Ionic 控件和导航创建应用文件夹结构、UI 路由和布局
6. 使用 AngularJS factory 获取访问令牌和 Outlook 服务客户端
7. 使用 O365 API 获取：a.) 今天的会议（事件开始日期是今天），b.) 明天的会议（事件开始日期是明天），c.) 开始日期是今天或今天之后的所有事件
8. 使用 O365 API 删除事件
9. 使用 O365 API 添加新事件
10. 运行应用！

![应用程序登录页面](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![应用程序日历视图](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calandar-list.png)
![应用程序日历事件详细信息页面](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-event.png)

### 步骤 1：使用 Visual Studio 创建空白的 Codrova
通过选择“文件”-->“新建项目”-->“JavaScript”-->“Apache Cordova 应用”-->“空白应用模板”，在 Visual Studio 中创建新的 Cordova 项目。此示例使用了 JavaScript 代码，但你也可使用 TypeScript 编写 Cordova 应用。

### 步骤 2：添加 Ionic 框架
1.	从 Ionic 框架网站，选择“下载 beta 版”。
2.	提取 zip 包
3.	在 Visual Studio 解决方案资源管理器中的 Cordova 项目下新建名为 lib 的文件夹，并将提取到的内容复制到 lib 文件夹下。

![项目的文件夹结构](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**更新脚本引用**
- 在 index.html 中，在 Cordova 和 platformOverrides 脚本引用后面的 ``` <head> ``` 元素中添加以下 Ionic 引用。

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- 在 index.html 中，添加以下 ionic css 引用。
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### 第 3 步：向应用添加 O365 服务
请参阅[设置 Office 365 开发环境](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment)文档，了解如何注册 Office 365 开发人员网站以及如何为开发人员网站设置 Azure Active Directory 访问权限。

按照以下步骤，在 Visual Studio 中使用服务管理器添加和配置 Office 365 API。

1. 从 Visual Studio 库下载和安装 Office 365 API 工具
2. 在项目节点上，右键单击并选择**“添加”-->“连接的服务”**
3. 在“服务管理器”对话框的顶部，选择 Office 365 链接，然后选择“注册应用”。使用 Office 365 开发人员组织所用的租户管理员租户进行登录。
![“O365 服务管理器”对话框登录](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### 步骤 4：设置 O365 日历 tenet 的权限，以授予对应用的适当访问权限
选择日历，单击右侧窗格上的“权限…”链接，然后选择“对用户日历拥有完全访问权限”。类似地，如果你想要授予对应用的只读权限，请选择“阅读用户的日历”。

![“日历的 O365 权限范围”对话框](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-permission.png)

单击“应用”和“确定”以设置权限，并向项目添加 O365 API。这会将包含 JavaScript 库的“服务”文件夹添加到项目中。

![添加权限后的项目文件夹树](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

在 index.html 中，在 ``` <head> ``` 元素中添加以下 O365 引用。
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**步骤 5：使用 Ionic 控件和导航创建应用文件夹结构、UI 路由和布局**

1. 在项目根节点下创建应用文件夹。该文件夹将包含应用特定的文件。会提取数据并将其绑定到 UI 的每个 UI 组件都将具有与 UI 和模式背后代码非常类似的相应控制器。例如，calendar-list.html 将提供列表控件以显示用户事件，calendar-list-ctrl.js 将包含代码以使用 O365 API 提取用户事件。

![应用程序的项目文件夹树结构](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-app-folder.PNG)

**文件夹和文件详细信息：**
- **auth** 包含用于登录和注销的 UI 和代码。
- **layout** 包含用于显示应用内容和导航的 UI（例如 ion-pane、ion-side-menus 和 ion-nav-bar），以及用于绑定用户名的代码。
- **app.js** 包含用于导航到不同页面的 UI 路由。
- **service-o365.js** 包含用于获取访问令牌、创建 Outlook 服务客户端对象、进行注销和获取用户名的实用工具函数。这是作为 Angular factory 实现的，因此这些函数可作为实用工具函数在不同的页面上公开。

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
**创建“日历”标签页页面，以在不同的标签页显示今天的事件、明天的事件和所有事件**
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

### 步骤 6：使用 AngularJS factory 获取访问令牌和 Outlook 服务客户端

**获取访问令牌**
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
**创建 Outlook 服务客户端对象**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### 第 7 步：使用 O365 API 获取：a.) 今天的会议（事件开始日期是今天），b.) 明天的会议（事件开始日期是明天），c.) 开始日期是今天或今天之后的所有事件

**a.提取今天的会议（事件开始日期是今天）**
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

**b.提取明天的事件（事件开始日期是明天）**
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
**c.提取开始日期在今天或今天之后的所有事件**
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

### 步骤 8：使用 O365 API 删除事件
可使用 Outlook 客户端对象来删除事件，先使用事件 ID 获取要删除的事件，然后在事件对象上调用 delete() 以删除特定事件。
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

### 步骤 9：使用 O365 API 添加新事件
可使用 Outlook 客户端对象来添加、更新和删除事件。

**创建页面，以提交数据来创建新事件**
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

**使用以下代码创建新事件**
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

### 步骤 10：运行应用

1. 选择 Android，并面向 Android Emulator 或设备。请注意，O365 身份验证当前不支持 Ripple。

![目标平台选择栏](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**按 F5 运行应用**

要更详细地了解如何在不同平台上运行 Cordova 应用，请参阅[部署和运行使用 Visual Studio Tools for Apache Cordova 构建的应用](http://msdn.microsoft.com/en-us/library/dn757049.aspx)。


此项目已采用 [Microsoft 开源行为准则](https://opensource.microsoft.com/codeofconduct/)。有关详细信息，请参阅[行为准则 FAQ](https://opensource.microsoft.com/codeofconduct/faq/)。如有其他任何问题或意见，也可联系 [opencode@microsoft.com](mailto:opencode@microsoft.com)。

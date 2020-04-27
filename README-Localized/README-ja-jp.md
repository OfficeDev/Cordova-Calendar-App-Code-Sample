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
## Cordova 予定表クライアント アプリ

このサンプル アプリは、Ionic フレームワークおよび O365 Outlook サービスを使用して一から Cordova アプリを作成する方法を段階的に示しています。

「[Visual Studio Tools for Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx)」および「[Getting Started with Visual Studio Tools for Apache Cordova (Visual Studio Tools for Apache Cordova の使用を開始する)](http://msdn.microsoft.com/en-us/library/dn771545.aspx)」を経て Cordova 開発環境をセットアップすることを強くお勧めします。

このチュートリアルでは、次の手順を実行します

1. Visual Studio を使用して空白の Cordova を作成する
2. Ionic フレームワークを追加する
3. O365 サービスをアプリに追加する
4. O365 予定表の原則にアクセス許可を設定して、アプリへの適切なアクセスを許可する
5. Ionic コントロールとナビゲーションを使用して、アプリのフォルダー構造、UI ルーティング、レイアウトを作成する
6. アクセス トークンを取得し、AngularJS ファクトリを使用して Outlook サービス クライアントを取得します
7. O365 API を使用して a.) を取得する 今日の会議 (イベント開始日が今日と等しい)、b.) 明日の会議 (イベント開始日が明日と等しい) と c.) 開始日が今日以上のすべてのイベント
8. O365 API を使用してイベントを削除する
9. O365 API を使用して新しいイベントを追加する
10. アプリを実行する !

![アプリケーション ログイン ページ](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![アプリケーション予定表ビュー](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calandar-list.png)
![アプリケーション予定表イベントの詳細ページ](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-event.png)

### 手順 1: Visual Studio を使用して空白の Cordova を作成する
[ファイル] --> [新しいプロジェクト] --> [JavaScript] --> [Apache Cordova アプリ] --> [空白のアプリ テンプレート] を選択して、Visual Studio で新しい Cordova プロジェクトを作成します。このサンプルでは JavaScript コードを使用していますが、TypeScript で Cordova アプリを作成することもできます。

### 手順 2:Ionic フレームワークを追加する
1.	Ionic フレームワークの Web サイトから、[ベータ版のダウンロード] を選びます。
2.	ZIP を解凍する
3.	Visual Studio ソリューション エクスプローラーの Cordova プロジェクトの下に lib という名前の新しいフォルダーを作成し、展開したコンテンツを lib フォルダーの下にコピーします。

![project 用のフォルダー構造](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**スクリプト参照を更新する**
- index.html で、Cordova および platformOverrides スクリプト参照の後に、次の Ionic 参照を ```<head>``` 要素に追加します。

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- index.html で、次の Ionic CSS 参照を追加します。
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### 手順 3:O365 サービスをアプリに追加する
「[Office 365 開発環境のセットアップ](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment)」ドキュメントを参照して、Office 365 開発者向けサイトにサインアップし、開発者向けサイトの Azure Active Directory アクセスをセットアップします。

Visual Studio のサービス マネージャーを使用して Office 365 API を追加して構成するには、次の手順に従います。

1. Visual Studio ギャラリーから Office 365 API ツールをダウンロードしてインストールする
2. プロジェクト ノードを右クリックして、**[追加] > [接続済みサービス]** を選ぶ
3. [サービス マネージャー] ダイアログ ボックスの上部にある [Office 365] リンクをクリックして、[アプリを登録する] を選択します。Office 365 開発者の組織のテナント管理者アカウントでサインインします。
![O365 サービス マネージャーのダイアログ サインイン](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### 手順 4: O365 予定表の原則にアクセス許可を設定して、アプリへの適切なアクセスを許可する
予定表を選択し、右側のウィンドウにある [アクセス許可...] リンクをクリックして、[ユーザーの予定表へのフル アクセス] を選択します。同様に、アプリへの読み取りアクセスのみを許可する場合は、[ユーザーの予定表を読み取る] を選択します。

![予定表ダイアログの O365 アクセス許可スコープ](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-permission.png)

[適用] および [OK] をクリックしてアクセス許可を設定し、O365 API をプロジェクトに追加します。これにより、JavaScript ライブラリを含む Service フォルダーがプロジェクトに追加されます。

![アクセス許可を追加した後の project フォルダー ツリー](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

index.html で、次の O365 参照を ```<head>``` 要素に追加します。
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**手順 5:Ionic コントロールとナビゲーションを使用して、アプリのフォルダー構造、UI ルーティング、レイアウトを作成する**

1. プロジェクト ルート ノードの下に app フォルダーを作成します。app フォルダーには、アプリ固有のファイルが含まれます。データを取得して UI にバインドする各 UI コンポーネントには、UI およびコード ビハインド パターンと同様に、対応するコントローラーがあります。たとえば、calendar-list.html はリスト コントロールを表示してユーザー イベントを表示し、calendar-list-ctrl.js には O365 API を使用してユーザー イベントを取得するコードが含まれます。

![アプリケーション用の project フォルダー ツリー構造](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-app-folder.PNG)

**フォルダーとファイルの詳細**:
- **auth** には、サインインおよびサインアウトのための UI とコードが含まれています
- **layout** には、アプリ コンテンツや ion-pane、ion-side-menus、ion-nav-bar、およびユーザー名をバインドするコードなどのナビゲーションを表示するための UI が含まれています。
- **app.js** には、さまざまなページに移動するための UI ルーティングが含まれています
- **service-o365.js** には、アクセス トークンを取得し、Outlook サービス クライアント オブジェクトを作成し、サインアウトしてユーザー名を取得するためのユーティリティ関数が含まれています。これは Angular ファクトリとして実装されているため、これらの関数はさまざまなページにわたってユーティリティ関数として公開できます。

**UI ルーティングを定義する app.js**
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
**予定表タブ ページを作成して、今日のイベント、明日のイベント、すべてのイベントを異なるタブに表示します**
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

### 手順 6: アクセス トークンを取得し、AngularJS ファクトリを使用して Outlook サービス クライアントを取得します

**アクセストークンの取得**
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
**Outlook サービス クライアント オブジェクトを作成する**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### 手順 7:O365 API を使用して a.) を取得する 今日の会議 (イベント開始日が今日と等しい)、b.) 明日の会議 (イベント開始日が明日と等しい) と c.) 開始日が今日以上のすべてのイベント

**a.今日の会議を取得する (イベント開始日が今日と等しい)**
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

**b.明日の会議を取得する (イベント開始日が明日と等しい)**
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
**c.開始日が今日以上のすべてのイベントを取得します\**
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

### 手順 8:O365 API を使用してイベントを削除する
Outlook クライアント オブジェクトを使用してイベントを削除することができます。まずイベント ID を使用して削除するイベントを取得し、次にイベント オブジェクトで delete() を呼び出して特定のイベントを削除します。
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

### 手順 9:O365 API を使用して新しいイベントを追加する
Outlook クライアント オブジェクトを使用して、イベントの追加、更新、削除を行うことができます。

**新しいイベントを作成するためのデータを送信するページを作成する**
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

**次のコードを使用して、新しいイベントを作成する**
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

### 手順 10:アプリを実行する

1. Android を選択し、Android エミュレーターまたはデバイスとしてターゲットにします。現在、Ripple は O365 認証でサポートされていないことにご注意ください。

![ターゲット プラットフォームの選択バー](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 キーを押してアプリを実行する**

異なるプラットフォームに渡り Cordova アプリを実行する方法の詳細については、「[Deploy and Run Your App Built with Visual Studio Tools for Apache Cordova (Visual Studio Tools for Apache Cordova で構築されたアプリの展開と実行)](http://msdn.microsoft.com/en-us/library/dn757049.aspx)」を参照してください。


このプロジェクトでは、[Microsoft Open Source Code of Conduct (Microsoft オープン ソース倫理規定)](https://opensource.microsoft.com/codeofconduct/) が採用されています。詳細については、「[倫理規定の FAQ](https://opensource.microsoft.com/codeofconduct/faq/)」を参照してください。また、その他の質問やコメントがあれば、[opencode@microsoft.com](mailto:opencode@microsoft.com) までお問い合わせください。

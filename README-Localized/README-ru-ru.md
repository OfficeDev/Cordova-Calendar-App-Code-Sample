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
## Приложение клиента календаря Cordova

В этом примере приложения шаг за шагом показано, как создать приложение Cordova с использованием Ionic Framework и O365 Outlook с нуля.

Настоятельно рекомендуется пройти через [инструменты Visual Studio для Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) и [Начало работы с инструментами Visual Studio для Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) для настройки среды разработки Cordova.

В этом уроке вы будете эти шаги

1. Создание Blank Cordova в среде Visual Studio
2. Добавить Ionic Framework
3. Добавить сервисы O365 в приложение
4. Установите разрешения для календаря O365 для предоставления соответствующего доступа к приложению
5. Создание структуры папок приложения, маршрутизации и макета пользовательского интерфейса с использованием элементов управления и навигации Ionic.
6. Получите токен доступа и получите клиент служб Outlook, используя фабрику AngularJS
7. Используйте O365 API для получения a.) Сегодняшняя встреча (дата начала мероприятия равна сегодня), б.) Завтрашнее собрание (дата начала мероприятия равна завтра) и c.) Все события с начальной датой больше или равной сегодняшнему дню
8. Используйте O365 API для удаления события
9. Используйте O365 API для добавления нового события
10. Запуск приложения!

![Страница входа в приложение](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Просмотр календаря приложения](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calandar-list.png)
![Страница сведений о событии в календаре приложения](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-event.png)

### Шаг 1. Создание Blank Cordova в среде Visual Studio
Чтобы создать новый проект Cordova в Visual Studio, выберите File --> New project --> JavaScript --> Apache Cordova Apps --> Blank App template. В этом примере используется код JavaScript, но вы также можете написать свое приложение Cordova на TypeScript.

### Шаг 2. Добавить Ionic Framework
1.	На веб-сайте Ionic Framework выберите Загрузить бета-версию.
2.	Извлечение ZIP-архива
3.	Создайте новую папку с именем lib в проекте Cordova в обозревателе решений Visual Studio и скопируйте извлеченный контент в папку lib.

![Структура папок для Project](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**обновить ссылки на скрипты**
— in. HTML, добавьте указанные ниже ионные ссылки в ``` < головка > ```, после того как ссылаются на platformOverrides.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- В index. HTML добавьте ниже ионную ссылку CSS.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Этап 3. Добавить сервисы O365 в приложение
См. документацию [Настройка среды разработки Office 365](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) в разделе Регистрация на сайте разработчика Office 365 и настройка доступа Azure Active Directory к сайту разработчика.

Выполните следующие действия, чтобы добавить и настроить API-интерфейсы Office 365 с помощью диспетчера служб в Visual Studio.

1. Загрузите и установите инструменты Office 365 API из галереи Visual Studio
2. На узле проекта щелкните правой кнопкой мыши и выберите **Добавить -> Подключенная служба**
3. В верхней части диалогового окна «Диспетчер служб» выберите ссылку Office 365, а затем выберите «Зарегистрировать приложение». Войдите в систему с учетной записью администратора клиента для вашей организации-разработчика Office 365.
![Вход в O365 Services Manager](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Этап 4. Установите разрешения для календаря O365 для предоставления соответствующего доступа к приложению
Выберите Календарь и щелкните ссылку «Разрешения...» на правой панели, а затем выберите «иметь полный доступ к календарю пользователей». Аналогичным образом, если вы хотите предоставить доступ только для чтения к приложению, выберите «Чтение календаря пользователей».

![Области разрешений O365 для календаря](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-permission.png)

Нажмите Apply и Ok, чтобы установить разрешение и добавить O365 API в проект. Это добавит в проект папку Service, содержащую библиотеки JavaScript.

![дерево папок проекта после добавления разрешений](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

В index.html добавьте следующие ссылки O365 в элемент ``` <head> ```.
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Шаг 5 Создание структуры папок приложения, маршрутизации пользовательского интерфейса и макета с использованием элементов управления Ionic и навигации **

1. Создайте папку приложения под корневым узлом проекта. Папка приложения будет содержать файлы, специфичные для приложения. Каждый компонент пользовательского интерфейса, который выполняет выборку и привязку данных к пользовательскому интерфейсу, будет иметь соответствующий контроллер, аналогичный пользовательскому интерфейсу и шаблону кода. Например, calendar-list.html покажет элемент управления списком для отображения пользовательских событий, а calendar-list-ctrl.js будет содержать код для извлечения пользовательских событий с использованием O365 API.

![древовидная структура папок проекта для приложения](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-app-folder.PNG)

**папка и сведения о файлах.**
- **проверка подлинности** содержат пользовательский интерфейс и код для входа в систему и выхода из нее
- **макет** содержит элементы пользовательского интерфейса и элементы навигации, такие как литий-и управляющие элементы, которые представляют собой ионную и программную панель навигации, а также код для привязки имени пользователя.
— **app.js** содержит функцию маршрутизации пользовательского интерфейса для перехода на различные страницы.
- **service-o365.js** содержит служебную функцию для получения маркера доступа, создания объекта клиента служб Outlook, выхода и получения имени пользователя. Это реализовано как Angular factory, так что эти функции могут быть представлены в виде служебной функции на разных страницах.

**app.js, на котором определена маршрутизация пользовательского интерфейса**
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
** Создать вкладку Календарь, чтобы показать сегодняшние, завтрашние и все события на разных вкладках **
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

### Этап 6. Получите токен доступа и получите клиент служб Outlook, используя фабрику AngularJS

**получить маркер доступа**
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
### Этап 7. Используйте O365 API для получения a.) Сегодняшняя встреча (дата начала мероприятия равна сегодня), б.) Завтрашнее собрание (дата начала мероприятия равна завтра) и c.) Все события с начальной датой больше или равной сегодняшнему дню

**a. Получить сегодняшнюю встречу (Дата начала события равна сегодняшней)**
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

**b. Извлечение завтрашнего дня (Дата начала события в прошлом)**
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
**c. Извлечение всех событий с датой начала или выше текущей версии **
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

### Этап 8. Используйте O365 API для удаления события
Клиентский объект Outlook можно использовать для удаления события, сначала получить событие, которое вы хотите удалить, используя идентификатор события, а затем вызвать delete () для объекта события, чтобы удалить конкретное событие.
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

### Этап 9. Используйте O365 API для добавления нового события
Клиентский объект Outlook можно использовать для добавления, обновления и удаления события.

**Создайте страницу для отправки данных для создания нового события**
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

**использовать следующий код для создания нового события**
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

### Шаг 10. Запуск приложения

1. Выберите Android и выберите его в качестве Android Emulator или устройства. Обратите внимание, что в настоящее время Ripple не поддерживается для аутентификации O365.

![панель выбора целевой платформы](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 для запуска приложения**

Ознакомьтесь [развертывании и запуске приложения, созданного с помощью средств Visual Studio Tools для Apache Cordova](http://msdn.microsoft.com/en-us/library/dn757049.aspx) Подробнее о том, как запустить приложение Cordova на разных платформах.


Этот проект соответствует [Правилам поведения разработчиков открытого кода Майкрософт](https://opensource.microsoft.com/codeofconduct/). Дополнительные сведения см. в разделе [часто задаваемых вопросов о правилах поведения](https://opensource.microsoft.com/codeofconduct/faq/). Если у вас возникли вопросы или замечания, напишите нам по адресу [opencode@microsoft.com](mailto:opencode@microsoft.com).

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
## Aplicación cliente de calendario de Cordova

Esta aplicación de ejemplo muestra paso a paso cómo crear desde cero una aplicación de Cordova con el marco Ionic y los servicios de Outlook de O365.

Le recomendamos encarecidamente que vea [Visual Studio Tools para Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) e [Introducción a Visual Studio Tools para Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) para instalar el entorno de desarrollo de Cordova.

En este tutorial, aprenderá los siguientes pasos:

1. Crear Cordova en blanco con Visual Studio.
2. Agregar el marco Ionic.
3. Agregar servicios de O365 a la aplicación.
4. Establecer permisos para el calendario de O365 para conceder el acceso apropiado a la aplicación.
5. Crear una estructura de carpetas de aplicaciones, enrutamiento y diseño de la interfaz de usuario con la navegación y controles de Ionic.
6. Adquirir un token de acceso y obtener el cliente de servicios de Outlook con la factoría de AngularJS.
7. Usar la API de O365 para obtener: a). La reunión de hoy (la fecha de inicio del evento es la de hoy). b). La reunión de mañana (la fecha de inicio del evento es la de mañana). c). Todos los eventos con fecha de inicio mayor o igual a la de hoy
8. Usar la API de O365 para eliminar el evento.
9. Usar la API de O365 para agregar un nuevo evento.
10. ¡Ejecutar la aplicación!

![Página de inicio de sesión de la aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Vista de calendario de la aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calandar-list.png)
![Página de detalles de eventos del calendario de aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-event.png)

### Paso 1: Crear Cordova en blanco con Visual Studio
Cree un nuevo proyecto de Cordova en Visual Studio, eligiendo Archivo: --> Nuevo proyecto: --> JavaScript, --> Aplicaciones de Apache Cordova --> Plantilla de aplicación vacía. Este ejemplo usa código JavaScript, pero también puede escribir la aplicación de Cordova en TypeScript.

### Paso 2: Agregar el marco Ionic
1.	Desde el sitio web del marco Ionic, elija Descargar beta.
2.	Descomprima el archivo zip
3.	Cree una nueva carpeta denominada lib en el proyecto de Cordova en el explorador de soluciones de Visual Studio y copie el contenido descomprimido en la carpeta lib.

![Estructura de carpetas para el proyecto](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

Actualizar las referencias al script
- En index.html, agregue las siguientes referencias a Ionic en el elemento ``` <head> ```, después de las referencias al script de Cordova y platformOverrides.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- En index.html, agregue las siguientes referencias de CSS Ionic.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Paso 3: Agregar servicios de O365 a la aplicación
Consulte la documentación [Configurar el entorno de desarrollo de Office 365](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) para  suscribirse a un sitio para desarrolladores de Office 365 y configurar el acceso de Azure Active Directory para su sitio de desarrolladores.

Siga estos pasos para agregar y configurar las API de Office 365 mediante el Administrador de servicios en Visual Studio.

1. Asegúrese de descargar e instalar las herramientas de la API de Office 365 desde la Galería de Visual Studio.
2. En el nodo proyecto, haga clic con el botón derecho y elija **Agregar --> Servicio conectado**
3. En la parte superior del cuadro de diálogo del Administrador de servicios, elija el vínculo Office 365 y luego seleccione Registrar su aplicación. Conéctese con una cuenta de Administrador de espacios empresariales de su organización de desarrolladores de Office 365.
![Inicio de sesión del administrador de servicios de O365](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Paso 4: Establecer permisos para el calendario de O365 para conceder el acceso apropiado a la aplicación
Seleccione Calendario y haga clic en Permisos... situado en el panel derecho y, luego, seleccione "Tener acceso total al calendario de usuarios". Si lo que desea es dar solo acceso de lectura a la aplicación, seleccione "Acceso de lectura al calendario de usuarios".

![Ámbitos de permiso de O365 para el cuadro de diálogo Calendario](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-permission.png)

Haga clic en Aplicar y Aceptar para establecer el permiso y agregar la API de O365 al proyecto. Esto agregará la carpeta Servicio que contiene las bibliotecas de JavaScript del proyecto.

![Árbol de carpetas del proyecto después de agregar permisos](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

En index.html, agregue las siguientes referencias de O365 al elemento ``` <head> ```
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Paso 5: Crear una estructura de carpetas de aplicaciones, enrutamiento y diseño de la interfaz de usuario con la navegación y controles de Ionic**

1. Cree una carpeta de aplicación en el nodo raíz del proyecto. La carpeta de aplicación contendrá archivos específicos de la aplicación. Cada componente de la interfaz de usuario que recupera y enlaza datos a la interfaz de usuario, tendrá un controlador correspondiente muy similar a la interfaz de usuario y patrones de código subyacentes. Por ejemplo, calendar-list.html mostrará el control de lista para visualizar eventos de usuario y calendar-list-ctrl.js contendrá código para capturar eventos de usuarios mediante la API de O365.

![Estructura de árbol de las carpetas del proyecto para la aplicación](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-app-folder.PNG)

**Detalle de archivo y carpetas:**
- **auth** contiene la interfaz de usuario y el código para iniciar y cerrar sesión
- **layout** contiene la interfaz de usuario para mostrar el contenido y para la navegación de la aplicación como el panel de ion, los menús laterales de ion, la barra de navegación de ion y código para enlazar el nombre de usuario.
-**app.js** contiene el enrutamiento de la interfaz de usuario para ir a las distintas páginas:
-**service-o365.js** contiene una función de utilidad para obtener el token de acceso, crear un objeto de cliente de servicios de Outlook, cerrar sesión y obtener el nombre del usuario. Esto se implementa como una factoría de Angular para que las funciones puedan exponerse como una función de utilidad en diferentes páginas.

**app.js que define el enrutamiento de la interfaz de usuario**
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
**Crear página de la pestaña Calendario que muestre los eventos de hoy, de mañana y todos los eventos en distintas pestañas**
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

### Paso 6: Adquirir un token de acceso y obtener el cliente de servicios de Outlook con la factoría de AngularJS

**Adquirir un token de acceso**
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
**crear un objeto de cliente para servicios de Outlook**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### Paso 7: Usar la API de O365 para obtener: a). La reunión de hoy (la fecha de inicio del evento es la de hoy). b). La reunión de mañana (la fecha de inicio del evento es la de mañana). c). Todos los eventos con fecha de inicio mayor o igual que la de hoy

**a. Obtener la reunión de hoy (la fecha de inicio es la de hoy) **
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

**b. Obtener la reunión de mañana (la fecha de inicio del evento es la de mañana)**
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

### Paso 8: Usar la API de O365 para eliminar el evento.
El objeto de cliente de Outlook puede servir para eliminar eventos. Primero, obtenga el evento que desea eliminar utilizando su id. de evento y luego llame a delete() en el objeto del evento para eliminarlo.
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

### Paso 9: Usar la API de O365 para agregar un nuevo evento.
El objeto de cliente de Outlook puede usarse para agregar, actualizar y eliminar eventos.

**Cree la página para enviar los datos con el fin de crear un nuevo evento.**
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

**Use el siguiente código para crear un nuevo evento**
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

### Paso 10: Ejecutar la aplicación

1. Seleccione Android, ya sea en un emulador o dispositivo de Android. Tenga en cuenta que actualmente no se permite Ripple para la autenticación de O365.

![barra de selección de plataforma de destino](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**Presione F5 para ejecutar la aplicación**

Consulte [Implementar y ejecutar una aplicación para Apache Cordova creada con Visual Studio Tools](http://msdn.microsoft.com/en-us/library/dn757049.aspx) para ver información adicional sobre cómo ejecutar la aplicación de Cordova en distintas plataformas.


Este proyecto ha adoptado el [Código de conducta de código abierto de Microsoft](https://opensource.microsoft.com/codeofconduct/). Para obtener más información, vea [Preguntas frecuentes sobre el código de conducta](https://opensource.microsoft.com/codeofconduct/faq/) o póngase en contacto con [opencode@microsoft.com](mailto:opencode@microsoft.com) si tiene otras preguntas o comentarios.

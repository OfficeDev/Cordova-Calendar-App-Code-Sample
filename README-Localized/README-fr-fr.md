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
## Application cliente Calendrier Cordova

Cet application exemple explique comment créer une application Cordova à l’aide de l’infrastructure Ionic et des services Outlook O365 à partir de zéro.

Nous vous recommandons vivement de passer en revue [Outils Visual Studio pour Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) et [Prise en main des Outils Visual Studio pour Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) pour la configuration de l’environnement de développement Cordova.

Ce tutoriel vous montre comment effectuer les opérations suivantes :

1. Créer un Cordova vide à l’aide de Visual Studio
2. Ajouter une infrastructure Ionic
3. Ajouter des services Office 365 à l’application
4. Définir des autorisations sur le calendrier O365 pour accorder l’accès approprié à l’application
5. Créer une structure de dossiers d’applications, routage et disposition d’interface utilisateur à l’aide de commandes et navigation Ionic
6. Acquérir un jeton d’accès et obtenir le client Outlook services à l’aide de AngularJS Factory
7. Utiliser l’API O365 pour extraire a.) Réunion d’aujourd’hui (la date de début de l’événement est égale à aujourd’hui), b.) Réunion de demain (la date de début de l’événement est égale à demain), et c.) Tous les événements dont la date de début est supérieure ou égale à aujourd’hui
8. Utiliser l’API O365 pour supprimer un événement
9. Utiliser l’API O365 pour ajouter un nouvel événement
10. Exécuter l’application !

![Page de connexion de l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Affichage Calendrier de l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calandar-list.png)
![Page Détails de l’événement du calendrier de l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-event.png)

### Étape 1 : Créer un Cordova vide à l’aide de Visual Studio
Créer un projet Cordova dans Visual Studio en sélectionnant Fichier--> Nouveau projet--> JavaScript--> Applications Cordova Apache--> Modèle d’application vide. Cet exemple utilise du code JavaScript, mais vous pouvez également écrire votre application Cordova dans TypeScript.

### Étape 2 : Ajouter une infrastructure Ionic
1.	Sur le site Web de l’infrastructure Ionic, sélectionnez Télécharger la version bêta.
2.	Extraire le fichier zip
3.	Créer un dossier nommé lib sous Projet Cordova dans l’Explorateur de solutions Visual Studio et copier le contenu extrait sous le dossier lib.

![Structure de dossier pour Projet](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**Mettre à jour les références de script**:
dans index.html, ajouter les références Ionic suivantes dans l’élément ``` < head > ```, après les références de script Cordova et platformOverrides.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- Dans index.html, ajouter la référence CSS Ionic suivante.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Étape 3 : Ajouter des services Office 365 à l’application
Consultez la documentation[Configurer votre environnement de développement Office 365](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) sur l’inscription à un site développeur Office 365 et configurez l’accès à Azure Active Directory pour votre site de développeur.

Procédez comme suit pour ajouter et configurer des API Office 365 à l’aide du gestionnaire de services dans Visual Studio.

1. Téléchargez et installez les outils d’API Office 365 à partir de la galerie Visual Studio.
2. Sur le nœud de projet, cliquez avec le bouton droit, puis sélectionnez **Ajouter--> Service connecté**
3. Dans la partie supérieure de la boîte de dialogue Gestionnaire des services, sélectionnez le lien Office 365, puis sélectionnez Enregistrer votre application. Connectez-vous à l’aide d’un compte d’administrateur client pour votre organisation Office 365 Developer.
![Boîte de dialogue Gestionnaire des services O365](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Étape 4 : Définir des autorisations sur le calendrier O365 pour accorder l’accès approprié à l’application
Sélectionnez Calendrier, puis cliquez sur le lien Autorisations... dans le volet droit, puis sélectionnez l’option «accès complet au calendrier des utilisateurs». De même, si vous voulez accorder un accès en lecture uniquement à l’application, sélectionnez « Lire le calendrier des utilisateurs ».

![Étendues d’autorisations O365 pour la boîte de dialogue calendrier](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-permission.png)

Cliquez sur Appliquer, puis sur OK pour définir l’autorisation et ajouter l’API Office 365 au Projet. Cette opération ajoute un dossier de Service contenant des bibliothèques JavaScript au projet.

![Arborescence des dossiers de projets après avoir ajouté des autorisations](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

Dans index.html, ajoutez les références O365 suivantes dans l’élément ``` < tête > ``` .
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Étape 5 : Créer une structure de dossiers d’applications, routage et disposition d’interface utilisateur à l’aide de commandes et navigation**

1. Créez un dossier d’application sous le nœud racine du projet. Le dossier d’application contiendra les fichiers spécifiques à l’application. Chaque composant d’interface utilisateur qui récupère et lie les données à l’interface utilisateur disposera d’un contrôleur correspondant, comme l’interface utilisateur et le modèle de code. Par exemple, calendar-list.html affiche le contrôle de liste pour afficher les événements utilisateur et calendar-list-ctrl.js contient du code pour extraire les événements des utilisateurs à l’aide de l’API Office 365.

![Structure arborescente des dossiers de projets pour l’application](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-app-folder.PNG)

**Détail de dossier et fichier :**
-**authentification** contient l’interface utilisateur et du code pour la connexion et la déconnexion
-**disposition** contient l’interface utilisateur pour afficher le contenu de l’application et la navigation, comme le volet ion, les menus côté ion, la barre de navigation ion et le code pour lier le nom d’utilisateur.
-**app.js** contient le routage d’interface utilisateur pour accéder à différentes pages
-**service-o365.js** contient une fonction utilitaire pour obtenir un jeton d’accès, créer un objet client Outlook services, se déconnecter et obtenir un nom d’utilisateur. Ceci est implémenté comme une Angular factory de sorte que ces fonctions puissent être exposées en tant que fonction utilitaire sur différentes pages.

**app.js définissant le routage interface utilisateur**
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

### Étape 6 : Acquérir un jeton d’accès et obtenir le client Outlook services à l’aide de AngularJS Factory

**Obtenir un jeton d’accès**
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
### Étape 7 : Utiliser l’API O365 pour extraire a.) Réunion d’aujourd’hui (la date de début de l’événement est égale à aujourd’hui), b.) Réunion de demain (la date de début de l’événement est égale à demain), et c.) Tous les événements dont la date de début est supérieure ou égale à aujourd’hui

**a. Récupérer la réunion d’aujourd’hui (date de début d’événement égale à aujourd’hui)**
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

**b. Récupérer la réunion de demain (la date de début de l’événement est égale à demain)**
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
**c. Récupérer tous les événements dont la date de début est supérieure ou égale à aujourd’hui **
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

### Étape 8 :Step 8: Utiliser l’API O365 pour supprimer un événement
L’objet client Outlook peut être utilisé pour supprimer l’événement : obtenez tout d’abord l’événement que vous voulez supprimer à l’aide d’un ID d’événement, puis appeler delete() sur l’objet événement pour supprimer l’événement en question.
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

### Étape 9 : Utiliser l’API O365 pour ajouter un nouvel événement
Un objet client Outlook peut être utilisé pour ajouter, mettre à jour et supprimer un événement.

**Créer la page pour soumettre les données pour créer un nouvel événement**
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

**Utiliser le code suivant pour créer un nouvel événement**
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

### Étape 10 : Exécuter l’application

1. Sélectionnez Android et la cible comme émulateur ou appareil Android. Veuillez noter que Ripple n’est actuellement pas pris en charge pour l’authentification O365.

![Barre de sélection de plateforme cible](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 pour exécuter l’application**

Voir [Déployer et exécuter votre application conçue avec Visual Studio Tools pour Apache Cordova](http://msdn.microsoft.com/en-us/library/dn757049.aspx)pour plus d’informations sur l’exécution de l’application Cordova sur différentes plateformes.


Ce projet a adopté le [Code de conduite Open Source de Microsoft](https://opensource.microsoft.com/codeofconduct/). Pour en savoir plus, reportez-vous à la [FAQ relative au code de conduite](https://opensource.microsoft.com/codeofconduct/faq/) ou contactez [opencode@microsoft.com](mailto:opencode@microsoft.com) pour toute question ou tout commentaire.

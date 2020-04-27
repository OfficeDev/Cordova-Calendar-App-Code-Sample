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
## Aplicativo cliente de calendário do Cordova

Este aplicativo de exemplo mostra o passo a passo de como criar a partir do zero um aplicativo Cordova usando o Ionic Framework e os serviços do O365 Outlook.

É altamente recomendável ler [Ferramentas do Visual Studio para Apache Cordova](http://www.visualstudio.com/en-us/explore/cordova-vs.aspx) e [Introdução às ferramentas do Visual Studio para Apache Cordova](http://msdn.microsoft.com/en-us/library/dn771545.aspx) para configurar o ambiente de desenvolvimento do Cordova.

Neste tutorial, você verá estas etapas

1. Criar Cordova em branco usando o Visual Studio
2. Adicionar o Ionic Framework
3. Adicionar os serviços O365 ao aplicativo
4. Definir permissões para o locatário de calendário do O365 para conceder acesso apropriado ao aplicativo
5. Criar uma estrutura de pastas de aplicativos, layout e roteamento da interface do usuário usando controles e navegação Ionic
6. Adquirir um token de acesso e obter o cliente de serviços do Outlook usando o factory do AngularJS
7. Usar a API do O365 para buscar a.) Reunião hoje (a data de início do evento é igual a hoje), b.) Reunião amanhã (a data de início do evento é igual a amanhã) e c.) Todos os eventos com data inicial maior ou igual a hoje
8. Usar a API do O365 para excluir o evento
9. Usar a API do O365 para adicionar um novo evento
10. Executar o aplicativo!

![Página de logon do aplicativo](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/login.png)
![Exibição de calendário do aplicativo](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calandar-list.png)
![Página detalhes de eventos do calendário do aplicativo](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/New-event.png)

### Etapa 1: Criar Cordova em branco usando o Visual Studio
Crie um novo projeto do Cordova no Visual Studio escolhendo: Arquivo –> Novo projeto –> JavaScript –> Aplicativos Apache Cordova –> Modelo de aplicativo em branco. Este exemplo usa código JavaScript, mas também é possível escrever seu aplicativo do Cordova em TypeScript.

### Etapa 2: Adicionar o Ionic Framework
1.	No site do Ionic Framework, escolha baixar versão beta.
2.	Extraia o zip
3.	Gerenciador de soluções do Visual Studio crie uma nova pasta chamada lib em projeto do Cordova e copie o conteúdo extraído para esta pasta.

![Estrutura de pastas para o projeto](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Ionic.png)

**Atualize as referências de script**
e em index.html, adicione as seguintes referências do Ionic ao elemento ``` <head> ```, depois das referências de script do Cordova e de platformOverrides.

```html
<script src="lib/ionic/js/ionic.bundle.min.js"></script>
```
- No index.html, adicione a seguinte referência css do Ionic.
```html
 <link href="lib/ionic/css/ionic.min.css" rel="stylesheet" />
```
### Etapa 3: Adicionar os serviços O365 ao aplicativo
Confira na documentação [Configurar seu ambiente de desenvolvimento do Office 365](http://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment) sobre como se Inscrever no site de desenvolvedor do Office 365 e Configurar o acesso ao Azure Active Directory para seu site de desenvolvedor.

Siga estas etapas para adicionar e configurar as APIs do Office 365 usando o Gerenciador de Serviços do Visual Studio.

1. Baixar e instalar as Ferramentas de API do Office 365 na Galeria do Visual Studio
2. No nó do projeto, clique com o botão direito do mouse e escolha **Adicionar –> Serviço conectado**
3. Na parte superior da caixa de diálogo Gerenciador de Serviços, escolha o link do Office 365 e, em seguida, escolha Registrar seu aplicativo. Entre com uma conta de administrador locatário na sua organização de desenvolvedor do Office 365.
![Caixa de diálogo de entrada do Gerenciador de Serviços do O365](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/ServiceManager.png)

### Etapa 4: Definir permissões para o locatário de calendário do O365 para conceder acesso apropriado ao aplicativo
Selecione Calendário e clique no link Permissões... no painel direito e, em seguida, selecione "Ter acesso total aos calendários dos usuários". Da mesma forma, se desejar conceder apenas o acesso de leitura para o aplicativo, selecione "Ler os calendários dos usuários".

![Escopo de permissão do O365 para caixa de diálogo calendário](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-permission.png)

Clique em Aplicar e em OK para definir a permissão e adicionar a API do O365 ao projeto. Isso adicionará ao projeto a pasta Serviço que contêm as bibliotecas JavaScript.

![árvore de pastas do projeto depois de adicionar permissões](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/service-folder.png)

Em index.html, adicione as seguintes referências do O365 ao elemento ``` <head>```.
```html
<script src="services/office365/scripts/o365loader.js"></script>  
<script src="services/office365/settings/settings.js"></script>
```
**Etapa 5: Criar uma estrutura de pastas de aplicativos, layout e roteamento da interface do usuário usando controles e navegação Ionic**

1. Criar uma pasta de aplicativos no nó da raiz do projeto. A pasta de aplicativos conterá os arquivos específicos do aplicativo. Cada componente da interface do usuário que busca e vincula os dados à interface do usuário terá um controlador correspondente, semelhante à interface do usuário e ao código oculto do padrão. Por exemplo, calendar-list.html mostrará o controle de lista para exibir os eventos do usuário, e calendar-list-ctrl.js conterá o código para buscar eventos de usuários usando a API do O365.

![estrutura de árvore da pasta do projeto para o aplicativo](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Calendar-app-folder.PNG)

**Detalhes da pasta e do arquivo:**
- **auth** contém a interface do usuário e o código para entrar e sair
- **layout** contém a interface do usuário para exibir o conteúdo do aplicativo e a navegação, como o painel, os menus laterias, a barra de navegação do ion e o código para associar o nome de usuário.
- **app.js** contém o roteamento da interface do usuário para navegar por páginas diferentes
- **service-o365.js** contém a função utilitária para obter o token de acesso, criar objeto de clientes de serviços do Outlook, sair e obter o nome de usuário. Isso é implementado como uma factory Angular para que essas funções possam ser expostas como funções utilitárias em diferentes páginas.

**app.js definindo o roteamento da interface de usuário**
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
**Página da guia Criar Calendário para mostrar os eventos de hoje, amanhã e todos os eventos em diferentes abas**
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

### Etapa 6: Adquirir um token de acesso e obter o cliente de serviços do Outlook usando o factory do AngularJS

**Adquirir um token de acesso**
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
**criar objeto de cliente de serviços do Outlook**
```javascript
var outlookClient = new Microsoft.OutlookServices.Client('https://outlook.office365.com/api/v1.0', authtoken.getAccessTokenFn('https://outlook.office365.com'));
```
### Etapa 7: Usar a API do O365 para buscar a.) Reunião hoje (a data de início do evento é igual a hoje), b.) Reunião amanhã (a data de início do evento é igual a amanhã) e c.) Todos os eventos com data inicial maior ou igual a hoje

**a. Buscar a reunião de hoje (a data de início do evento é igual a hoje)**
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

**b. Buscar a reunião de amanhã (a data de início do evento é igual a amanhã)**
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
**c. Buscar todos os eventos com data de início maior ou igual a hoje\**
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

### Etapa 8: Usar a API do O365 para excluir o evento
O objeto cliente do Outlook pode ser usado para excluir o evento, primeiro obtenha o evento que você deseja excluir usando a ID do evento e, em seguida, chame delete () no objeto de evento para excluir o evento específico.
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

### Etapa 9: Usar a API do O365 para adicionar um novo evento
O objeto cliente do Outlook pode ser usado para adicionar, atualizar e excluir eventos.

**Crie a página para enviar os dados para a criação de novo evento**
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

**Use o código a seguir para criar um novo evento**
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

### Etapa 10: Executar o aplicativo

1. Selecione Android e o destino como um Emulador ou Dispositivo Android. Observe que atualmente o Ripple não é compatível com a autenticação do O365.

![barra de seleção da plataforma de destino](https://github.com/abhikum/mobiledev/blob/gh-pages/O365AppImages/Android%20-%20Run.PNG)

**F5 para executar o aplicativo**

Confira em [Implantar e executar seu aplicativo criado com as ferramentas do Visual Studio para Apache Cordova](http://msdn.microsoft.com/en-us/library/dn757049.aspx) mais detalhes sobre como executar o aplicativo Cordova em diferentes plataformas.


Este projeto adotou o [Código de Conduta de Código Aberto da Microsoft](https://opensource.microsoft.com/codeofconduct/).  Para saber mais, confira [Perguntas frequentes sobre o Código de Conduta](https://opensource.microsoft.com/codeofconduct/faq/) ou contate [opencode@microsoft.com](mailto:opencode@microsoft.com) se tiver outras dúvidas ou comentários.

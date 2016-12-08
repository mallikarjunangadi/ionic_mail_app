// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// var db = null; 
angular.module('starter', ['ionic', 'starter.controllers','starter.service', 'starter.filter', 'ngCordova','ion-floating-menu'])

.run(function($ionicPlatform, $cordovaSQLite,$rootScope) {
  $ionicPlatform.ready(function() { 
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
 
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.cordova) {
      $rootScope.db = $cordovaSQLite.openDB({ name: "mailApp.db", location: 'default' }); //device
     console.log("Android");
    }else{
      $rootScope.db = window.openDatabase("mailApp.db", '1', 'mail', 1024 * 1024 * 100); // browser
      console.log("browser");
    } 

    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS inbox (id integer primary key, mailDateTime text, mailTo text, mailFrom text, mailCc text, mailBcc text, mailSubject text, mailBody text, attachments text)").then( console.log('Inbox table created Successfully'));
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS sentMails (id integer primary key, mailDateTime text, mailTo text, mailFrom text, mailCc text, mailBcc text, mailSubject text, mailBody text, attachments text)").then( console.log('Sent mail table created Successfully'));
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS bin (id integer primary key, mailDateTime text, mailTo text, mailFrom text, mailCc text, mailBcc text, mailSubject text, mailBody text, attachments text)").then( console.log('bin table created Successfully'));
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS drafts (id integer primary key, mailDateTime text, mailTo text, mailFrom text, mailCc text, mailBcc text, mailSubject text, mailBody text, attachments text)").then( console.log('draft table created Successfully'));
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS spam (id integer primary key, mailDateTime text, mailTo text, mailFrom text, mailCc text, mailBcc text, mailSubject text, mailBody text, attachments text)").then( console.log('spam table created Successfully'));
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS files (id integer primary key, fileName text, description text)").then( console.log('files table created Successfully'));
  });
}) 

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
 
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: ''
  })

  .state('app.inbox', {
    url: '/inbox',
    views: {
      'menuContent': {
        templateUrl: 'templates/inbox.html'
      }
    }
  })

  .state('app.sent', {
      url: '/sent',
      views: {
        'menuContent': {
          templateUrl: 'templates/sent.html'
        }
      }
    })

    .state('app.drafts', {
      url: '/drafts',
      views: {
        'menuContent': {
          templateUrl: 'templates/drafts.html'
        }
      }
    })
    .state('app.spam', {
      url: '/spam',
      views: {
        'menuContent': {
          templateUrl: 'templates/spam.html'
        }
      }
    })
    .state('app.bin', {
      url: '/bin',
      views: {
        'menuContent': {
          templateUrl: 'templates/bin.html'
        }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    })
    .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'templates/help.html'
        }
      }
    })
    .state('app.compose', {
      url: '/compose',
      views: {
        'menuContent': {
          templateUrl: 'templates/compose.html'
        }
      }
    })
    .state('app.signature', {
      url: '/signature',
      views: {
        'menuContent': {
          templateUrl: 'templates/signature.html'
        }
      }
    }) 

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/inbox');
})

.directive('textarea', function() {

  return {
    restrict: 'E',
    link: function(scope, element, attr){
        var update = function(){
            element.css("height", "auto");
            var height = element[0].scrollHeight; 
            element.css("height", element[0].scrollHeight + "px");
        };
        scope.$watch(attr.ngModel, function(){
            update();
        });
    }
  };
});

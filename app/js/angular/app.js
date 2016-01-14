var app = angular.module('app', ['ui.router', 'ngCookies', 'xeditable']);
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});


app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {


  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

  $urlRouterProvider.otherwise("/");

  $stateProvider.state('items', {
    url: '/lists/:listId/items',
    templateUrl: 'items.html',
    controllerProvider: function() {
      return 'itemsController';
    }
  }).state('/', {
    url: '/',
    templateUrl: 'index.html',
    controllerProvider: function() {
      return 'sessionsController';
    }
  })
}])

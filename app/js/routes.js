angular.module('hierarchie')
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'app/views/charts.html',
        controller: 'MainCtrl'
      })
        .when('/fcc', {
          templateUrl: 'app/views/fcc.html',
          controller: 'FccCtrl'
        })
        .when('/about', {
          templateUrl: 'app/views/about.html'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ]);
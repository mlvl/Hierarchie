define(['angular', 'app'], function(angular, app) {
	'use strict';

	return app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'app/views/charts.html',
			controller: 'MainCtrl'
		});
		$routeProvider.otherwise({redirectTo: '/'});
	}]);

});
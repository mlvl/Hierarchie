define(['angular', 'services'], function (angular, services) {
	'use strict';

	/* Filters */
  
	angular.module('recursiviz.filters', ['recursiviz.services'])
		.filter('interpolate', ['version', function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
	}]);
});

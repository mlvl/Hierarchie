define([
	'angular',
	'filters',
	'services',
	'directives',
	'controllers',
	'angularRoute',
  'directives/sunburst',
  'directives/sunburst-perspective',
  'directives/partition',
  'directives/breadcrumb'
	], function (angular, filters, services, directives, controllers) {
		'use strict';

		// Declare app level module which depends on filters, and services
		
		return angular.module('recursiviz', [
			'ngRoute',
			'recursiviz.controllers',
			'recursiviz.filters',
			'recursiviz.services',
			'recursiviz.directives'
		]);
});

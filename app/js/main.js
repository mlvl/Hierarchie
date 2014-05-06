require.config({
	paths: {
		angular: '../../bower_components/angular/angular',
		angularRoute: '../../bower_components/angular-route/angular-route',
		text: '../../bower_components/requirejs-text/text',
    underscore: '../../bower_components/underscore/underscore',
		d3: '../../bower_components/d3/d3.min'
	},
  /* Ability to shim D3 was removed in v3.4.0. We must manually require it for use. 
   * https://github.com/mbostock/d3/issues/1693 */
	shim: {
    'underscore': {
      exports: '_'
    },
    'angular': {'exports': 'angular'},
    'angularRoute': ['angular'],
  },
  priority: [
    "angular"
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes',
	'underscore'
], function(angular, app, routes, underscore) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([app['name']]);
	});
});


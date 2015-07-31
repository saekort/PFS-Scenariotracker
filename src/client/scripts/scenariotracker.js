
(function(){
    'use strict';

    var scenariotracker = angular.module('scenariotracker', ['ui.bootstrap','ui-rangeSlider', 'angularSpinner','ui.router','ui.check']);
    
    // Standard config of modules
    scenariotracker.config(function (usSpinnerConfigProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
        usSpinnerConfigProvider.setDefaults({color: '#521717'});

        $stateProvider
        	.state('search', {
        		url: '/search',
        		templateUrl: "views/search.html",
        		controller: 'SearchController',
        		controllerAs: 'vm'        		
        	})
        	.state('register', {
        		url: '/register',
        		templateUrl: "views/register.html",
        		controller: 'RegisterController',
        		controllerAs: 'vm'        		
        	})        	
        	.state('report', {
        		url: '/report',
        		templateUrl: "views/report.html",
        		controller: 'ReportController',
        		controllerAs: 'vm'        		
        	});
        
        $urlRouterProvider.otherwise("/search");
    });
    
    scenariotracker.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

})();
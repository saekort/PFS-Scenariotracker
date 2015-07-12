
(function(){
    'use strict';

    var scenariotracker = angular.module('scenariotracker', ['ui.bootstrap','ui-rangeSlider', 'angularSpinner','ui.router']);
    
    // Standard config of modules
    scenariotracker.config(function (usSpinnerConfigProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
        usSpinnerConfigProvider.setDefaults({color: '#521717'});

        $stateProvider
        	.state('home', {
        		url: '',
        		templateUrl: "views/home.html",
        		controller: 'HomeController',
        		controllerAs: 'vm'
        	})
        	.state('search', {
        		url: '/search',
        		templateUrl: "views/search.html",
        		controller: 'SearchController',
        		controllerAs: 'vm'        		
        	})
        	.state('report', {
        		url: '/report',
        		templateUrl: "views/report.html",
        		controller: 'ReportController',
        		controllerAs: 'vm'        		
        	});
    });

})();
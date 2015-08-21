
(function(){
    'use strict';

    var scenariotracker = angular.module('scenariotracker', ['ui.bootstrap', 'angularSpinner','ui.router','ui.check','ngStorage']);
    
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
        	.state('plan', {
        		url: '/plan',
        		templateUrl: "views/plan.html",
        		controller: 'PlanController',
        		controllerAs: 'vm'        		
        	})        	
        	.state('register', {
        		url: '/register',
        		templateUrl: "views/register.html",
        		controller: 'RegisterController',
        		controllerAs: 'vm'        		
        	})
        	.state('issues', {
        		url: '/issues',
        		templateUrl: "views/issues.html",
            	controller: 'IssuesController',
            	controllerAs: 'vm'        			
        	})
        	.state('about', {
        		url: '/about',
        		templateUrl: "views/about.html",
        		controller: 'AboutController',
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
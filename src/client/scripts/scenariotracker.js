
(function(){
    'use strict';

    var scenariotracker = angular.module('scenariotracker', ['ui.bootstrap', 'angularSpinner','ui.router','ui.check','ngStorage','validation.match']);
    
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
        	.state('statistics', {
        		url: '/statistics',
        		templateUrl: "views/statistics.html",
        		controller: 'StatisticsController',
        		controllerAs: 'vm'        		
        	})
        	.state('login', {
        		url: '/login',
        		templateUrl: "views/login.html",
        		controller: 'LoginController',
        		controllerAs: 'vm'        		
        	})
        	.state('profile', {
        		url: '/profile',
        		templateUrl: "views/profile.html",
        		controller: 'ProfileController',
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
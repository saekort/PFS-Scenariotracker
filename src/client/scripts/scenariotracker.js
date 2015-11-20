
(function(){
    'use strict';

    var scenariotracker = angular.module('scenariotracker', ['ui.bootstrap', 'angularSpinner','ui.router','ui.check','ngStorage','validation.match','tracker.tools', 'dndLists']);
    
    // Standard config of modules
    scenariotracker.config(function (usSpinnerConfigProvider, $stateProvider, $urlRouterProvider, $locationProvider, $provide, $httpProvider) {
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
        	})
        	.state('characters', {
        		url: '/characters',
        		templateUrl: "views/characters.html",
        		controller: 'CharacterController',
        		controllerAs: 'vm'        		
        	})        	
	    	.state('passwordrecover', {
	    		url: '/passwordrecover',
	    		templateUrl: "views/passwordrecover.html",
	    		controller: 'PasswordrecoverController',
	    		controllerAs: 'vm'	
	    	})
	    	.state('passwordreset', {
	    		url: '/passwordreset',
	    		templateUrl: "views/passwordreset.html",
	    		controller: 'PasswordresetController',
	    		controllerAs: 'vm'	
	    	}); 	    	
        
        $urlRouterProvider.otherwise("/search");
       
        $httpProvider.interceptors.push('trackerInterceptor');        
        
    });
    
    scenariotracker.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

    scenariotracker.run(['$rootScope', function($rootScope) 
    {
    	$rootScope.$on('$stateChangeSuccess',function(){
    	    $("html, body").animate({ scrollTop: 0 }, 200);
    	});
    }])
    
})();
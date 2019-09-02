(function(){
    'use strict';

    var admintracker = angular.module('admintracker', 
    		['ui.bootstrap', 
    		 'angularSpinner',
    		 'ui.router',
    		 'ui.check',
    		 'ngStorage',
    		 'validation.match',
    		 'admintracker.tools',
    		 'dndLists',
    		 'ngAnimate',
    		 'toastr']);
    
    // Set config
    admintracker.constant('trackerConfig', {'apiUrl': 'https://localhost:3443/'});    
    
    // Standard config of modules
    admintracker.config(function (usSpinnerConfigProvider, $stateProvider, $urlRouterProvider, $locationProvider, $provide, $httpProvider, toastrConfig) {
        usSpinnerConfigProvider.setDefaults({color: '#521717'});
        
        $stateProvider
        	.state('dashboard', {
        		url: '/dashboard',
        		templateUrl: "views/dashboard.html",
        		controller: 'DashboardController',
        		controllerAs: 'vm'        		
	    	})
        	.state('authors', {
        		url: '/authors',
        		templateUrl: "views/authors.html",
        		controller: 'AuthorsController',
        		controllerAs: 'vm'        		
	    	})
	    	.state('author', {
        		url: '/author/:id',
        		templateUrl: "views/author.html",
        		controller: 'AuthorsController',
        		controllerAs: 'vm'        		
	    	})
        	.state('scenarios', {
        		url: '/scenarios',
        		templateUrl: "views/scenarios.html",
        		controller: 'ScenariosController',
        		controllerAs: 'vm'        		
	    	})
	    	.state('error', {
        		url: '/error',
        		templateUrl: "views/error.html",
        		controller: 'ErrorController',
        		controllerAs: 'vm'        		
	    	}); 
        
        $urlRouterProvider.otherwise("/dashboard");
       
        $httpProvider.interceptors.push('admintrackerInterceptor');       
        
        angular.extend(toastrConfig, {
        	timeOut: 1500
        });
    });
    
    admintracker.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

    admintracker.run(['$rootScope', function($rootScope) 
    {
    	$rootScope.$on('$stateChangeSuccess',function(){
    	    $("html, body").animate({ scrollTop: 0 }, 200);
    	});
    }])
    
})();
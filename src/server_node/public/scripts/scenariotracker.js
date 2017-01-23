
(function(){
    'use strict';

    var scenariotracker = angular.module('scenariotracker', 
    		['ui.bootstrap', 
    		 'angularSpinner',
    		 'ui.router',
    		 'ui.check',
    		 'ngStorage',
    		 'validation.match',
    		 'tracker.tools', 
    		 'dndLists',
    		 'ngAnimate',
    		 'toastr']);
    
    // Set config
    scenariotracker.constant('trackerConfig', {'apiUrl': 'https://localhost:3443/'});    
    
    // Standard config of modules
    scenariotracker.config(function (usSpinnerConfigProvider, $stateProvider, $urlRouterProvider, $locationProvider, $provide, $httpProvider, toastrConfig) {
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
        	.state('players-report', {
        		url: '/players/:pfsNumber/:report',
        		templateUrl: "views/players.html",
        		controller: 'PlayersController',
        		controllerAs: 'vm'        		
        	})
        	.state('players', {
        		url: '/players/:pfsNumber/:report',
        		templateUrl: "views/players.html",
        		controller: 'PlayersController',
        		controllerAs: 'vm'        		
        	})
        	.state('players-index', {
        		url: '/players',
        		templateUrl: "views/players.html",
        		controller: 'PlayersController',
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
        	.state('settings', {
        		url: '/settings',
        		templateUrl: "views/profile.html",
        		controller: 'ProfileController',
        		controllerAs: 'vm'        		
        	})
        	.state('import', {
        		url: '/import',
        		templateUrl: "views/import.html",
        		controller: 'ImportController',
        		controllerAs: 'vm'        		
        	})
        	.state('report', {
        		url: '/report/:pfsNumber',
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
        	.state('groups', {
        		url: '/groups',
        		templateUrl: "views/groups.html",
        		controller: 'GroupController',
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
        
        angular.extend(toastrConfig, {
        	timeOut: 1500
        });
    });
    
    scenariotracker.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

    scenariotracker.run(['$rootScope', function($rootScope) 
    {
    	$rootScope.$on('$stateChangeSuccess',function(){
    	    $("html, body").animate({ scrollTop: 0 }, 200);
    	});
    }])
    
})();
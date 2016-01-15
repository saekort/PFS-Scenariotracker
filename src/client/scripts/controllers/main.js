(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController($state, $location, $http, $scope, $rootScope, $localStorage, trackerConfig)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.trackerConfig = trackerConfig;
    	vm.$storage = $localStorage;
    	
//    	if(typeof(vm.$storage.api_key) !== 'undefined')
//    	{
//    		$http.defaults.headers.common = {'CC-API-KEY': vm.$storage.api_key}
//    	}
//    	else
//    	{
//    		delete vm.$storage.player;
//    		delete vm.$storage.api_key;
//    		$http.defaults.headers.common = {'CC-API-KEY': 'nokey'};
//    	}
    	
    	// Set API-KEY headers based on value of api_key in $storage object
    	$scope.$watch('main.$storage.api_key', function(){
    		if(typeof(vm.$storage.api_key) !== 'undefined')
    		{
    			$http.defaults.headers.common = {'CC-API-KEY': vm.$storage.api_key}
    		}
    		else
    		{
    			$http.defaults.headers.common = {'CC-API-KEY': 'nokey'}
    		}
        });
    	
    	// If the injector notices that the user is logged out on the server also log him out locally
    	$scope.$on('Unauthorized', function() {
    		vm.logout();
    	});
    }

    MainController.prototype.logout = function() {
    	var vm = this;
    	
    	// Do the logout
    	var query = 'key=' + vm.$storage.api_key;
    	vm.$http.get(vm.trackerConfig.apiUrl + 'person_logout' + '?' + query).
  	  	  success(function(data, status, headers, config) {
  	  	  
  	  	  delete vm.$storage.api_key;
  	  	  delete vm.$storage.player;  	  
  	  	  vm.$state.go('search', {}, {reload: true});
  	  	  vm.$http.defaults.headers.common = {'CC-API-KEY': 'nokey'}
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  	  });
    }
    
})();
(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController($state, $location, $http, $scope, $rootScope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;

    	if(localStorage.getItem("api_key"))
    	{
    		console.log('Getting API key from localstorage');
    		vm.api_key = localStorage.getItem("api_key");
    		var temp = localStorage.getItem("player");
    		console.log(localStorage.getItem("api_key"));
    		vm.player = JSON.parse(temp);
    		$http.defaults.headers.common = {'CC-API-KEY': vm.api_key}
    	}
    	else
    	{
    		console.log('No API key in localstorage');
    		vm.player = false;
    		vm.api_key = false;
    		$http.defaults.headers.common = {'CC-API-KEY': 'nokey'};
    	}
    	    	
    	$scope.$watch('main.api_key', function(){
    		if(vm.api_key != false)
    		{
    			console.log('KEY changed!');
    			localStorage.api_key = vm.api_key;
    			localStorage.player = JSON.stringify(vm.player);
    			console.log('VM api key: ' + vm.api_key);
    			console.log(localStorage.getItem("api_key"));
    			$http.defaults.headers.common = {'CC-API-KEY': vm.api_key}
    		}
    		else
    		{
    			console.log('KEY removed!');
    			localStorage.removeItem("api_key");
    			localStorage.removeItem("player");
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
    	console.log('Logging out');
    	// Do the logout
    	var query = 'key=' + vm.api_key;
    	vm.$http.get('http://pfs.campaigncodex.com/api/v1/person_logout' + '?' + query).
  	  	  success(function(data, status, headers, config) {
  	  	  
  	  	  vm.api_key = false;
  	  	  vm.player = false;  	  	  
  	  	  vm.$state.go('search', {}, {reload: true});
  	  	  
  	  	  console.log('KEY removed through logout!');
  	  	  localStorage.removeItem("api_key");
  	  	  localStorage.removeItem("player");
  	  	  vm.$http.defaults.headers.common = {'CC-API-KEY': 'nokey'}
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  	  });
    }
    
})();
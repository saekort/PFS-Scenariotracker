(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController($state, $location, $http, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    
    	console.log(localStorage.getItem("api_key"));
    	if(localStorage.getItem("api_key")  !== 'undefined')
    	{
    		vm.api_key = localStorage.getItem("api_key");
    	}
    	else
    	{
    		vm.api_key = false;
    	}
    	
    	$scope.$watch('main.api_key', function(){
    		console.log('API_KEY changed');
    		if(vm.api_key != false)
    		{
    			localStorage.api_key = vm.api_key;
    		}
    		else
    		{
    			localStorage.removeItem("api_key");
    			vm.api_key = false;
    		}
        });
    }

    MainController.prototype.logout = function() {
    	var vm = this;
    	
    	// Do the logout
    	var query = 'key=' + vm.api_key;
    	vm.$http.get('http://pfs.campaigncodex.com/api/v1/person_logout' + '?' + query).
  	  	  success(function(data, status, headers, config) {
  	  	  
  	  	  vm.api_key = false;
  	  	  vm.$state.go('search');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  	  });
    }
})();
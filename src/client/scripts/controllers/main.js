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
    	
    	if(localStorage.getItem("api_key")  !== 'undefined')
    	{
    		vm.api_key = localStorage.getItem("api_key");
    		var temp = localStorage.getItem("player");
    		vm.player = JSON.parse(temp);
    		$http.defaults.headers.common = {'CC-API-KEY': vm.api_key}
    	}
    	else
    	{
    		vm.player = false;
    		vm.api_key = false;
    		$http.defaults.headers.common = {'CC-API-KEY': ''}
    	}
    	
    	$scope.$watch('main.api_key', function(){
    		if(vm.api_key != false)
    		{
    			console.log('KEY changed!');
    			localStorage.api_key = vm.api_key;
    			localStorage.player = JSON.stringify(vm.player);
    			$http.defaults.headers.common = {'CC-API-KEY': vm.api_key}
    		}
    		else
    		{
    			console.log('KEY removed!');
    			localStorage.removeItem("api_key");
    			localStorage.removeItem("player");
    			$http.defaults.headers.common = {'CC-API-KEY': ''}
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
  	  	  vm.player = false;
  	  	  vm.$state.go('search');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  	  });
    }
    
})();
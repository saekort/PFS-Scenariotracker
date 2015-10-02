(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController($state, $location, $http)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	
    	vm.loggedin = false;
    	
    	vm.checkLogin();
    }
    
    MainController.prototype.checkLogin = function()
    {
    	var vm = this;
    	console.log('Checking login');
    	// Do the login check
    	//vm.$http.get('http://pfs.campaigncodex.com/Cron/test').
    	vm.$http.get('http://pfs.campaigncodex.com/api/v1/person_logincheck').
  	  	  success(function(data, status, headers, config) {
  	  	  
  	  	  vm.loggedin = true;
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  console.log('Not currently logged in');
  	  });  
    	
    }
 
})();
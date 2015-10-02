(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('LoginController', LoginController );
    
    function LoginController($state, $location, $http, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.usSpinnerService = usSpinnerService;
    	
    	vm.username = '';
    	vm.password = '';
    	vm.status = '';
    }
    
    LoginController.prototype.doLogin = function(main)
    {
    	var vm = this;
    	
    	// Do the login
    	var query = 'login=' + vm.username + '&password=' + vm.password;
    	vm.$http.get('http://pfs.campaigncodex.com/api/v1/person_login' + '?' + query).
  	  	  success(function(data, status, headers, config) {
  	  	  
  	  	  main.loggedin = true;
  	  	  vm.$state.go('search');
  	  	  
  		  vm.usSpinnerService.stop('spinner-1');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  vm.status = 'Wrong username and/or password';
  		  vm.usSpinnerService.stop('spinner-1');
  	  });    	
    }
 
})();
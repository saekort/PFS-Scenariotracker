(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('LoginController', LoginController );
    
    function LoginController($state, $location, $http, usSpinnerService, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
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
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'person_login' + '?' + query).
  	  	  success(function(data, status, headers, config) {
  	  	  main.$storage.api_key = data.key;
  	  	  
  	  	  var temp = {'pfsnumber': data.pfsnumber, 'name': data.name};
  	  	  main.$storage.player = temp;
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
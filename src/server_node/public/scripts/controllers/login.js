(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('LoginController', LoginController );
    
    function LoginController($state, $location, $http, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	
    	vm.username = '';
    	vm.password = '';
    	vm.status = '';
    }
    
    LoginController.prototype.doLogin = function(main)
    {
    	var vm = this;
    	
    	var postData = {username: vm.username, password: vm.password};
    	
        var req = {
                method: 'POST',
                url: vm.main.trackerConfig.apiUrl + 'auth/login',
                data: $.param(postData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				main.$storage.token = data.token;
				
				main.$storage.user = data.user;
				vm.$state.go('search');
				main.toast('success', 'Welcome back ' + data.user.name);
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
			main.toast('warning', 'Wrong credentials');
			vm.password = '';
	  	});  	
    }
 
})();
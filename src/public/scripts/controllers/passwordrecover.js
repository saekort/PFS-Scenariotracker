(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('PasswordrecoverController', PasswordrecoverController );
    
    function PasswordrecoverController($state, $location, $http, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	
    	vm.playeremail = '';
    	vm.status = '';
    }
    
    PasswordrecoverController.prototype.recover = function()
    {
    	var vm = this;
    	
        var req = {
                method: 'POST',
                url: vm.main.trackerConfig.apiUrl + 'people/forgotpassword',
                data: $.param({email: vm.playeremail}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.$state.go('login');
				vm.main.toast('success', 'Password recovery email sent');
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		vm.main.toast('danger', 'Could not recover your password');
	  	});
    }
 
})();
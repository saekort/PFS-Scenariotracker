(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('PasswordresetController', PasswordresetController );
    
    function PasswordresetController($state, $location, $http, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	
    	vm.resetcode = '';
    	vm.playerpassword = '';
    	vm.playerpassword = '';
    	vm.checkpassword = '';
    	
    	// Make sure we are here with a resetcode, otherwise no reason to be here
    	if($location.search().resetcode && $location.search().resetcode != true)
    	{
    		vm.resetcode = $location.search().resetcode;
    	}
    	else
    	{
    		$state.go('search');
    	}
    	
    }
    
    PasswordresetController.prototype.reset = function()
    {
    	var vm = this;
    	
        var req = {
                method: 'POST',
                url: vm.main.trackerConfig.apiUrl + 'reset_password',
                data: $.param({password: vm.playerpassword, resetcode: vm.resetcode}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.status = 'Password successfully reset!';
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		vm.status = 'ERROR resetting your password!';
	  	});
    }
 
})();
(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('PasswordrecoverController', PasswordrecoverController );
    
    function PasswordrecoverController($state, $location, $http)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	
    	vm.playeremail = '';
    	vm.status = '';
    }
    
    PasswordrecoverController.prototype.recover = function()
    {
    	var vm = this;
    	
        var req = {
                method: 'POST',
                url: 'https://api.campaigncodex.com/api/v1/forgotten_password',
                data: $.param({email: vm.playeremail}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.status = 'Password recovery email sent';
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		vm.status = 'Something has gone wrong';
	  	});
    }
 
})();
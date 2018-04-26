(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('RegisterController', RegisterController );
    
    function RegisterController($http, $state, $scope, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	vm.playername = "";
    	vm.pfsnumber = "";
    	vm.playeremail = "";
    	vm.checkemail= "";
    	vm.playerpassword = "";
    	vm.checkpassword = "";
    	vm.othersmayreport = false;
    	vm.invalidpfsnumber = false;
    	vm.message = '';
    }
    
    RegisterController.prototype.savePlayer = function()
    {  	
    	var vm = this;
    	var person = {email : vm.playeremail, password : vm.playerpassword, name : vm.playername, pfsnumber : vm.pfsnumber, public : vm.othersmayreport};
    	
    	var method = 'POST';
      	
      	if(vm.othersmayreport)
      	{
      		var report = 1;
      	}
      	else
      	{
      		var report = 0;
      	}
      	
      	var req = {
      			method: method,
                url: vm.main.trackerConfig.apiUrl + 'people',
                data: $.param({pfsnumber : vm.pfsnumber, name : vm.playername, password : vm.playerpassword, public : report, email : vm.playeremail}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.$state.go('login');
				vm.main.toast('success', 'Registration successful, you may now login!');
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		vm.main.toast('error', 'Error while registering');
	  	});
       
       }

    RegisterController.prototype.checkPfsnumber = function()
    {
    	var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'people/pfsnumbercheck/' + vm.pfsnumber)
    	.then(function(response) {
			if(response.data !== 'available')
			{
				vm.invalidpfsnumber = true;
			}
			else
			{
				vm.invalidpfsnumber = false;
			}
    	});
    }    
})();
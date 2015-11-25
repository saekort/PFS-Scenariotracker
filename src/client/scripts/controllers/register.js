(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('RegisterController', RegisterController );
    
    function RegisterController($http, $state, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$http = $http;
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

    	console.log(person);
    	
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
                url: 'https://api.campaigncodex.com/api/v1/person',
                data: $.param({pfsnumber : vm.pfsnumber, name : vm.playername, password : vm.playerpassword, public : report, email : vm.playeremail}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.message = 'success';
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		console.log('ERROR saving content');
	  	});
       
       }

    RegisterController.prototype.checkPfsnumber = function()
    {
    	var vm = this;
    	
    	vm.$http.get('https://api.campaigncodex.com/api/v1/pfsnumber?pfsnumber=' + vm.pfsnumber).then(
    		function(response){
    			if(response.data != 'available')
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
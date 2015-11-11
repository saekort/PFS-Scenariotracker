(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ProfileController', ProfileController );
    
    function ProfileController($http, $state, $scope, usSpinnerService)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.$state = $state;
    	vm.$http = $http;
    	vm.usSpinnerService = usSpinnerService;
    	vm.playername = '';
    	vm.pfsnumber = '';
    	vm.playerreporting = false;
    	vm.profileUpdated = false;
    	vm.invalidpfsnumber = false;
    	vm.changedPassword = false;
    	
    	if(!vm.main.player)
    	{
    		// Not logged in, redirect
    		vm.$state.go('search');
    	}
    	
    	vm.getPlayer();
    }
    
    ProfileController.prototype.getPlayer = function()
    {
    	var vm = this;
    	
    vm.$http.get('http://pfs.campaigncodex.com/api/v1/person?pfsnumber=' + vm.main.player.pfsnumber).
  	  	success(function(data, status, headers, config) {
  		  // Assign profile
  		  vm.playername = data.name;
  		  vm.pfsnumber = data.pfsnumber;
  		  if(data.public == 1)
  		  {
  			  vm.playerreporting = true;
  		  };
  		  
  		  vm.usSpinnerService.stop('spinner-1');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  console.log('ERROR loading profile data');
  		  vm.usSpinnerService.stop('spinner-1');
  	  });    	
    }
    
    ProfileController.prototype.savePlayer = function()
    {
    	var vm = this;

        var req = {
                method: 'POST',
                url: 'http://pfs.campaigncodex.com/api/v1/profile',
                data: $.param({name: vm.playername, pfsnumber: vm.pfsnumber, public: vm.playerreporting}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				console.log('Updated profile');
				vm.profileUpdated = true;
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		console.log('ERROR saving content');
	  	});
    	
    	//TODO, make similar function here as we made for the register page
       
    }
    
    ProfileController.prototype.changePassword = function()
    {
    	var vm = this;
    	var req = {
                method: 'POST',
                url: 'http://pfs.campaigncodex.com/api/v1/change_password',
                data: $.param({old_password: vm.old_password, new_password: vm.playerpassword}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				console.log('Changed password');
				vm.changedPassword = true;
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		console.log('ERROR saving content');
	  	});
    }
    
    ProfileController.prototype.checkPfsnumber = function()
    {
    	var vm = this;
    	
    	if(vm.pfsnumber == vm.main.player.pfsnumber)
    	{
    		vm.invalidpfsnumber = false;
    	}
    	else
    	{
    		vm.$http.get('http://pfs.campaigncodex.com/api/v1/pfsnumber?pfsnumber=' + vm.pfsnumber).then(
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
    }
})();
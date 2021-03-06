(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ProfileController', ProfileController );
    
    function ProfileController($http, $state, $scope, $filter, usSpinnerService)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.$state = $state;
    	vm.$http = $http;
    	vm.$filter = $filter;
    	vm.usSpinnerService = usSpinnerService;
    	vm.playername = '';
    	vm.pfsnumber = '';
    	vm.playerreporting = false;
    	vm.profileUpdated = false;
    	vm.country = {name: '', code: ''};
    	
    	vm.countries = [
    	  {name: '', code: ''},    	                
    	  {name: 'Argentina', code: 'AR'}, 
    	  {name: 'Armenia', code: 'AM'}, 
    	  {name: 'Aruba', code: 'AW'}, 
    	  {name: 'Australia', code: 'AU'}, 
    	  {name: 'Austria', code: 'AT'}, 
    	  {name: 'Bahamas', code: 'BS'},  
    	  {name: 'Barbados', code: 'BB'}, 
    	  {name: 'Belarus', code: 'BY'}, 
    	  {name: 'Belgium', code: 'BE'}, 
    	  {name: 'Benin', code: 'BJ'}, 
    	  {name: 'Bermuda', code: 'BM'}, 
    	  {name: 'Bhutan', code: 'BT'}, 
    	  {name: 'Bolivia', code: 'BO'},  
    	  {name: 'Botswana', code: 'BW'}, 
    	  {name: 'Bouvet Island', code: 'BV'}, 
    	  {name: 'Brazil', code: 'BR'},   
    	  {name: 'Bulgaria', code: 'BG'},  
    	  {name: 'Burundi', code: 'BI'}, 
    	  {name: 'Cambodia', code: 'KH'}, 
    	  {name: 'Cameroon', code: 'CM'}, 
    	  {name: 'Canada', code: 'CA'}, 
    	  {name: 'Cayman Islands', code: 'KY'},  
    	  {name: 'Colombia', code: 'CO'}, 
    	  {name: 'Congo', code: 'CG'},   
    	  {name: 'Costa Rica', code: 'CR'},  
    	  {name: 'Croatia', code: 'HR'}, 
    	  {name: 'Cuba', code: 'CU'}, 
    	  {name: 'Czech Republic', code: 'CZ'}, 
    	  {name: 'Denmark', code: 'DK'},  
    	  {name: 'Dominican Republic', code: 'DO'}, 
    	  {name: 'Ecuador', code: 'EC'}, 
    	  {name: 'Egypt', code: 'EG'},       
    	  {name: 'Finland', code: 'FI'}, 
    	  {name: 'France', code: 'FR'}, 
    	  {name: 'French Guiana', code: 'GF'}, 
    	  {name: 'French Polynesia', code: 'PF'},  
    	  {name: 'Germany', code: 'DE'},  
    	  {name: 'Greece', code: 'GR'}, 
    	  {name: 'Greenland', code: 'GL'},   
    	  {name: 'Haiti', code: 'HT'},  
    	  {name: 'Hungary', code: 'HU'}, 
    	  {name: 'Iceland', code: 'IS'}, 
    	  {name: 'India', code: 'IN'}, 
    	  {name: 'Indonesia', code: 'ID'},  
    	  {name: 'Ireland', code: 'IE'},  
    	  {name: 'Israel', code: 'IL'}, 
    	  {name: 'Italy', code: 'IT'}, 
    	  {name: 'Jamaica', code: 'JM'},  
    	  {name: 'Lebanon', code: 'LB'}, 
    	  {name: 'Liberia', code: 'LR'},  
    	  {name: 'Liechtenstein', code: 'LI'}, 
    	  {name: 'Lithuania', code: 'LT'}, 
    	  {name: 'Luxembourg', code: 'LU'}, 
    	  {name: 'Madagascar', code: 'MG'}, 
    	  {name: 'Malta', code: 'MT'}, 
    	  {name: 'Mexico', code: 'MX'},   
    	  {name: 'Monaco', code: 'MC'}, 
    	  {name: 'Morocco', code: 'MA'},  
    	  {name: 'Nepal', code: 'NP'}, 
    	  {name: 'Netherlands', code: 'NL'}, 
    	  {name: 'Netherlands Antilles', code: 'AN'},  
    	  {name: 'New Zealand', code: 'NZ'}, 
    	  {name: 'Nigeria', code: 'NG'},   
    	  {name: 'Norway', code: 'NO'},  
    	  {name: 'Paraguay', code: 'PY'}, 
    	  {name: 'Peru', code: 'PE'}, 
    	  {name: 'Philippines', code: 'PH'},  
    	  {name: 'Poland', code: 'PL'}, 
    	  {name: 'Portugal', code: 'PT'}, 
    	  {name: 'Puerto Rico', code: 'PR'}, 
    	  {name: 'Romania', code: 'RO'}, 
    	  {name: 'Shackles', code: 'SH'},
    	  {name: 'Slovakia', code: 'SK'}, 
    	  {name: 'Slovenia', code: 'SI'},    
    	  {name: 'Spain', code: 'ES'}, 
    	  {name: 'Sudan', code: 'SD'}, 
    	  {name: 'Suriname', code: 'SR'},   
    	  {name: 'Sweden', code: 'SE'}, 
    	  {name: 'Switzerland', code: 'CH'},    
    	  {name: 'Turkey', code: 'TR'},  
    	  {name: 'United Kingdom', code: 'GB'}, 
    	  {name: 'United States', code: 'US'},  
    	  {name: 'Uruguay', code: 'UY'},  
    	  {name: 'Venezuela', code: 'VE'}
    	];
    	
    	if(typeof vm.main.$storage.user === 'undefined')
    	{
    		// Not logged in, redirect
    		vm.$state.go('search');
    	}
    	
    	vm.getPlayer();
    }
    
    ProfileController.prototype.getPlayer = function()
    {
    	var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'user')
    	.success(function(data, status, headers, config) {
  		  // Assign profile
  		  vm.playername = data.name;
  		  vm.pfsnumber = data.pfsnumber;
  		  
  		  if(data.public == 1)
  		  {
  			  vm.playerreporting = true;
  		  }
  		  
  		  if(data.public_characters == 1)
		  {
			  vm.publiccharacters = true;
		  }
  		  
  		  if(data.country)
  		  {
  			vm.country = vm.$filter('filter')(vm.countries, {code: data.country})[0];  
  		  }
  		  
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
                method: 'PUT',
                url: vm.main.trackerConfig.apiUrl + 'user',
                data: $.param({
                	name: vm.playername,
                	pfsnumber: vm.pfsnumber,
                	country: vm.country.code,
                	public: vm.playerreporting,
                	publiccharacters: vm.publiccharacters
                	}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.main.toast('success', 'Profile updated');
				//vm.profileUpdated = true;
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		vm.main.toast('error', 'Error while updating profile');
	  	});
    }
    
    ProfileController.prototype.changePassword = function()
    {
    	var vm = this;
    	var req = {
                method: 'PUT',
                url: vm.main.trackerConfig.apiUrl + 'user/password',
                data: $.param({old_password: vm.old_password, new_password: vm.playerpassword}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.main.toast('success', 'Changed password');
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		vm.main.toast('error', 'Error while updating password');
	  	});
    }
    
    ProfileController.prototype.checkPfsnumber = function()
    {
    	var vm = this;
    	
    	if(vm.pfsnumber == vm.main.$storage.player.pfsnumber)
    	{
    		vm.invalidpfsnumber = false;
    	}
    	else
    	{
    		vm.$http.get(vm.main.trackerConfig.apiUrl + 'user/pfsnumbercheck/' + vm.pfsnumber).then(
    			function(response){
    				console.log(response);
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
    }
})();
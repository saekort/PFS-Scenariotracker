(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController($http)
    {
    	var vm = this;
    	vm.$http = $http;
    	vm.scenarios = [];
    	vm.getScenarios() ; 
    }
    
    MainController.prototype.getScenarios = function()
    {
    	var vm = this;
    	vm.$http.get('http://localhost/pfs-scenariotracker/src/server_ci3/index.php/api/v1/scenarios').
    	  success(function(data, status, headers, config) {
    	    // this callback will be called asynchronously
    	    // when the response is available
    		  console.log(data);
    		  vm.scenarios = data;
    	  }).
    	  error(function(data, status, headers, config) {
    	    // called asynchronously if an error occurs
    	    // or server returns response with an error status.
    		  console.log('ERROR!');
    	  });
    	
    	console.log ('klik!');
    }
    
    // Define getScenarios function, get and return JSON of the service
    
})();
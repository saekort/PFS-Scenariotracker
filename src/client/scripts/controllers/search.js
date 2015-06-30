(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('SearchController', SearchController );
    
    function SearchController($http)
    {
    	var vm = this;
    	vm.$http = $http;
    	vm.scenarios = [];
    	vm.getScenarios();
    	vm.filters = [];
    	vm.filters.levelRangeMin = 1;
    	vm.filters.levelRangeMax = 12;
    	vm.filters.seasons = [];
    	vm.filters.authors = [];
    	vm.filters.players = [];
    }
    
    SearchController.prototype.getScenarios = function()
    {
    	var vm = this;
    	vm.$http.get('http://localhost/pfs-scenariotracker/src/server_ci3/index.php/api/v1/scenarios').
    	  success(function(data, status, headers, config) {
    	    // this callback will be called asynchronously
    	    // when the response is available
    		  vm.scenarios = data;
    	  }).
    	  error(function(data, status, headers, config) {
    	    // called asynchronously if an error occurs
    	    // or server returns response with an error status.
    		  console.log('ERROR loading scenarios');
    	  });
    }
    
})();
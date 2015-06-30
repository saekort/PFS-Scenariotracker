(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('SearchController', SearchController );
    
    function SearchController($http, usSpinnerService)
    {
    	var vm = this;
    	vm.$http = $http;
    	vm.usSpinnerService = usSpinnerService;
    	vm.scenarios = [];
    	vm.people = [];
    	vm.filters = [];
    	vm.filters.levelRangeMin = 1;
    	vm.filters.levelRangeMax = 12;
    	vm.filters.seasons = [];
    	vm.filters.authors = [];
    	vm.filters.players = [];
    	vm.filters.search = null;
    	
    	vm.pagination = [];
    	vm.pagination.totalItems = 0;
    	vm.pagination.currentPage = 1;
    	vm.pagination.pageSize = 20;
    	
    	vm.getPeople();
    	vm.getScenarios();
    }
    
    SearchController.prototype.getScenarios = function()
    {
    	var vm = this;
    	
    	// Empty the scenarios currently in memory
    	vm.scenarios = [];
    	vm.usSpinnerService.spin('spinner-1');
    	
    	// Define query string for filters]
    	// Foreach filters.seasons stukje string ala season[]=waarde& etc
    	
    	// Build the pagination string
    	var pagination = 'currentPage=' + vm.pagination.currentPage;
    	
    	vm.$http.get('http://localhost/pfs-scenariotracker/src/server_ci3/index.php/api/v1/scenarios' + '?' + pagination).
    	  success(function(data, status, headers, config) {
    		  // Assign scenarios
    		  vm.scenarios = data.scenarios;
    		  
    		  // Assign total found scenarios count
    		  vm.pagination.totalItems = data.count;
    		  vm.usSpinnerService.stop('spinner-1');
    	  }).
    	  error(function(data, status, headers, config) {
    	    // called asynchronously if an error occurs
    	    // or server returns response with an error status.
    		  console.log('ERROR loading scenarios');
    		  vm.usSpinnerService.stop('spinner-1');
    	  });
    }
    
    SearchController.prototype.getPeople = function()
    {
    	var vm = this;
    	vm.$http.get('http://localhost/pfs-scenariotracker/src/server_ci3/index.php/api/v1/people').
    	  success(function(data, status, headers, config) {
    	    // this callback will be called asynchronously
    	    // when the response is available
    		  vm.people = data;
    		  console.log (data);
    	  })
    }
    
    SearchController.prototype.changePage = function()
    {
    	var vm = this;
    	vm.getScenarios();
    }
})();
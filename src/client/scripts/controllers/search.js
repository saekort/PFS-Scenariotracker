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
    	vm.noScenarios = false;
    	vm.people = [];
    	vm.filters = [];
    	vm.filters.levelRangeMin = 1;
    	vm.filters.levelRangeMax = 12;
    	vm.filters.seasons = [
    	                      {key: 0, name: 0, checked: false},
    	                      {key: 1, name: 1, checked: false},
    	                      {key: 2, name: 2, checked: false},
    	                      {key: 3, name: 3, checked: false},
    	                      {key: 4, name: 4, checked: false},
    	                      {key: 5, name: 5, checked: false},
    	                      {key: 6, name: 6, checked: false},
    	                      {key: 7, name: 7, checked: false}];
    	vm.filters.authors = [];
    	vm.filters.players = [];
    	vm.filters.search = null;
    	vm.filters.evergreen = false;
    	vm.filters.retired = false;
    	
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
    	vm.noScenarios = false;

    	// Start spinning
    	vm.usSpinnerService.spin('spinner-1');
    	
    	// Build the pagination string
    	var query = 'currentPage=' + vm.pagination.currentPage;
    	
    	// Filter: Scenario name
    	if(vm.filters.search)
    	{
    		query = query + '&search=' + vm.filters.search;
    	}
    	
    	// Filter: Level range
    	if(vm.filters.levelRangeMin)
    	{
    		query = query + '&levelRangeMin=' + vm.filters.levelRangeMin;
    		query = query + '&levelRangeMax=' + vm.filters.levelRangeMax;
    	}
    	
    	// Filter: Seasons
    	if(vm.filters.seasons)
    	{
    		for (var index = 0; index < vm.filters.seasons.length; ++index)
    		{
    			if(vm.filters.seasons[index].checked)
    			{
    				query = query + '&season[]=' + vm.filters.seasons[index].key;
    			}
    		}
    	}
    	
    	// Filter: Evergreen
    	if(vm.filters.evergreen)
    	{
    		query = query + '&evergreen=true';
    	}
    	
    	// Filter: Retired
    	if(vm.filters.retired)
    	{
    		query = query + '&retired=true';
    	}
    	
    	vm.$http.get('http://localhost/pfs-scenariotracker/src/server_ci3/index.php/api/v1/scenarios' + '?' + query).
    	  success(function(data, status, headers, config) {
    		  // Assign scenarios
    		  vm.scenarios = data.scenarios;
    		  
    		  // Assign total found scenarios count
    		  vm.pagination.totalItems = data.count;
    		  
    		  if(data.count == 0)
    		  {
    		  	  vm.noScenarios = true;
    		  }
    		  
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
    	  })
    }
    
    SearchController.prototype.changePage = function()
    {
    	var vm = this;
    	vm.getScenarios();
    }
})();
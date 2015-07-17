(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('SearchController', SearchController );
    
    function SearchController($http, $state, $location, usSpinnerService)
    {
    	var vm = this;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$location = $location;
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
    	vm.filters.playersearch = null;
    	vm.filters.evergreen = false;
    	vm.filters.retired = false;
    	
    	vm.pagination = [];
    	vm.pagination.totalItems = 0;
    	vm.pagination.currentPage = 1;
    	vm.pagination.pageSize = 20;
    	
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
    	
    	// Filter: Players
    	if(vm.people)
    	{
    		for (var index = 0; index < vm.people.length; ++index)
    		{
    			query = query + '&player[]=' + vm.people[index].pfsnumber;
    		}
    	}
    	
    	vm.$http.get('http://pfs.campaigncodex.com/api/v1/scenarios' + '?' + query).
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
    
    SearchController.prototype.getPeople = function(search)
    {
    	var vm = this;
    	
    	return vm.$http.get('http://pfs.campaigncodex.com/api/v1/people?search=' + search).then(
    			function(response){
    				return response.data.map(function(item)
    				{
    					if(item.pfsnumber == null)
    					{
    						return item.name + ' (unknown)';
    					}
    					
    					return item.name + ' (' + item.pfsnumber + ')';
    				});
    			});
    }
    
    SearchController.prototype.changePage = function()
    {
    	var vm = this;
    	vm.getScenarios();
    }
    
    SearchController.prototype.removePlayer = function(index)
    {
    	var vm = this;
    	
    	if(index > -1)
    	{
    		vm.people.splice(index,1);
    	}
    	
    	vm.getScenarios();
    }
    
    SearchController.prototype.addPlayer = function()
    {
    	var vm = this;
    	
    	if(vm.filters.playersearch != null && vm.filters.playersearch != '')	
    	{
    		var searcharray = vm.filters.playersearch.split(" ");
    		var name = searcharray[0];
    		var pfsnumber = searcharray[1];
    		pfsnumber = pfsnumber.replace('(', '');
    		pfsnumber = pfsnumber.replace(')', '');
    		
    		if(pfsnumber != null && pfsnumber != 'unknown' && pfsnumber != '')
    		{
    			vm.$http.get('http://pfs.campaigncodex.com/api/v1/person/pfsnumber/' + pfsnumber).then(function(response){
    				vm.people.push(response.data[0]);
    				vm.filters.playersearch = '';
    				vm.getScenarios();
    				focus('playersearch');
    			});
    		}
    	}
    }
})();
(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('SearchController', SearchController );
    
    function SearchController($http, $state, $location, usSpinnerService, $localStorage, $scope)
    {
    	var vm = this;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$storage = $localStorage;
    	vm.$location = $location;
    	vm.main = $scope.main;
    	vm.usSpinnerService = usSpinnerService;
    	vm.scenarios = [];
    	vm.noScenarios = false;
    	vm.people = [];
    	vm.filters = [];
    	vm.filters.lowestPlayerLevel = '';
    	vm.filters.highestPlayerLevel = '';
    	vm.filters.levelRangeMin = 1;
    	vm.filters.levelRangeMax = 20;
    	vm.filters.levels = ['', 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    	vm.filters.seasons = [
    	                      {key: 0, name: 0, checked: false, col: 1},
    	                      {key: 1, name: 1, checked: false, col: 1},
    	                      {key: 2, name: 2, checked: false, col: 2},
    	                      {key: 3, name: 3, checked: false, col: 2},
    	                      {key: 4, name: 4, checked: false, col: 3},
    	                      {key: 5, name: 5, checked: false, col: 3},
    	                      {key: 6, name: 6, checked: false, col: 4},
    	                      {key: 7, name: 7, checked: false, col: 4}
    	                      ];
    	vm.filters.author;
    	vm.filters.players = [];
    	vm.filters.search = null;
    	vm.filters.playersearch = null;
    	vm.filters.campaign = 'pfs';
    	vm.filters.scenarios = true;
    	vm.filters.modules = true;
    	vm.filters.aps = true;
    	vm.filters.quests = true;    	
    	vm.filters.retired = false;
    	vm.filters.evergreen = false;
    	vm.filters.specials = false;
    	
    	vm.sortoptions = [
    	                  {key: 'name_asc', label: 'Name A-Z'},
    	                  {key: 'name_desc', label: 'Name Z-A'},
    	                  {key: 'season_asc', label: 'Number low-high'},
    	                  {key: 'season_desc', label: 'Number high-low'}
    	                  ];
    	
    	vm.sorting = vm.sortoptions[2];
    	
    	vm.pagination = [];
    	vm.pagination.totalItems = 0;
    	vm.pagination.currentPage = 1;
    	vm.pagination.pageSize = 10;
    	
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
    	
    	// Filters: Level range
    	if(vm.filters.lowestPlayerLevel != 0 && vm.filters.lowestPlayerLevel)
    	{
    		if(String(vm.filters.lowestPlayerLevel).length == 1)
    		{
    			// Add leading zero
    			query = query + '&levels[]=0' + vm.filters.lowestPlayerLevel;	
    		}
    		else
    		{
    			query = query + '&levels[]=' + vm.filters.lowestPlayerLevel;	
    		}
    		
    		if(vm.filters.highestPlayerLevel != 0 && vm.filters.highestPlayerLevel)
    		{
    			query = query + '&levels[]=' + vm.filters.highestPlayerLevel;
    		}
    	}
//    	if(vm.filters.levels)
//    	{
//    		for (var index = 0; index < vm.filters.levels.length; ++index)
//    		{
//    			if(vm.filters.levels[index].checked)
//    			{
//    				query = query + '&levels[]=' + vm.filters.levels[index].key;
//    			}
//    		}
//    	}
    	
//    	// Filter: Level range
//    	if(vm.filters.levelRangeMin)
//    	{
//    		query = query + '&levelRangeMin=' + vm.filters.levelRangeMin;
//    		query = query + '&levelRangeMax=' + vm.filters.levelRangeMax;
//    	}
    	
    	// Filter: Scenarios
    	if(vm.filters.scenarios)
    	{
    		query = query + '&scenarios=true';
    	}
    	
    	// Filter: Modules
    	if(vm.filters.modules)
    	{
    		query = query + '&modules=true';
    	}
    	
    	// Filter: Adventure paths
    	if(vm.filters.aps)
    	{
    		query = query + '&aps=true';
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
    	
    	// Filter: Campaign
    	if(vm.filters.campaign)
    	{
    		query = query + '&campaign=' + vm.filters.campaign;
    	}
    	
    	// Filter: Author
    	if(vm.filters.author)
    	{
    		query = query + '&author=' + vm.filters.author;
    	}    	
    	
    	// Filter: Evergreen
    	if(vm.filters.evergreen)
    	{
    		query = query + '&evergreen=true';
    	}

    	// Filter: Specials
    	if(vm.filters.specials)
    	{
    		query = query + '&specials=true';
    	}    	
    	
    	// Filter: Quests
    	if(vm.filters.quests)
    	{
    		query = query + '&quests=true';
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
    	
    	// Filter: Sorting
    	if(vm.sorting)
    	{
    		query = query + '&sorting=' + vm.sorting.key;
    	}
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'scenarios' + '?' + query).
    	  success(function(data, status, headers, config) {
    		  // Assign scenarios
    		  vm.scenarios = data.scenarios;
    		  
    		  // Assign total found scenarios count
    		  vm.pagination.totalItems = data.count;
    		  
    		  if(data.count == 0)
    		  {
    		  	  vm.noScenarios = true;
    		  }
    		  
    		  angular.forEach(vm.scenarios, function(value, key) {
    			  value.collapsed = true;
    		  });
    		  
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

    	return vm.$http.get(vm.main.trackerConfig.apiUrl + 'people?search=' + encodeURIComponent(search)).then(
    			function(response){
    				return response.data
    			});
    }

    SearchController.prototype.getAuthors = function(search)
    {
    	var vm = this;
    	
    	return vm.$http.get(vm.main.trackerConfig.apiUrl + 'authors?search=' + encodeURIComponent(search)).then(
    			function(response){
    				return response.data
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

    	if( Object.prototype.toString.call( vm.filters.playersearch ) === '[object Object]' ) {
    		vm.people.push(vm.filters.playersearch);
			vm.getScenarios();
    	}
    	
		vm.filters.playersearch = '';    	
    }
    
    SearchController.prototype.formatPlayersearch = function($model)
    {
    	if($model)
    	{
    		return $model.name + ' - ' + $model.pfsnumber;
    	}
    	
    	return '';
    }     
})();
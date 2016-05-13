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
    	vm.$localStorage = $localStorage;
    	vm.$location = $location;
    	vm.main = $scope.main;
    	vm.usSpinnerService = usSpinnerService;
    	vm.scenarios = [];
    	vm.noScenarios = false;
    	vm.people = [];
    	vm.gm = null;
    	
    	// Start data, hardcoded, this does not change dynamically
    	vm.data = {};
    	vm.data.levels = ['', 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    	vm.data.seasons = [
    	                      {key: 0, name: 0, checked: false, col: 1},
    	                      {key: 1, name: 1, checked: false, col: 1},
    	                      {key: 2, name: 2, checked: false, col: 1},
    	                      {key: 3, name: 3, checked: false, col: 2},
    	                      {key: 4, name: 4, checked: false, col: 2},
    	                      {key: 5, name: 5, checked: false, col: 2},
    	                      {key: 6, name: 6, checked: false, col: 3},
    	                      {key: 7, name: 7, checked: false, col: 3},
    	                      {key: 8, name: 8, checked: false, col: 3}
    	                      ];
    	vm.data.sortoptions = [
    	                  {key: 'name_asc', label: 'Name A-Z'},
    	                  {key: 'name_desc', label: 'Name Z-A'},
    	                  {key: 'season_asc', label: 'Number low-high'},
    	                  {key: 'season_desc', label: 'Number high-low'}
    	                  ];
    	// End data
    	if(angular.isUndefined(vm.$localStorage.search_filters)) { 
    		vm.initFilters();
    		
    	}
    	
    	vm.filters = $localStorage.search_filters;
    	
    	
    	vm.search = {};
    	vm.search.author = '';
    	vm.search.scenario = '';
    	vm.search.player = null;
    	vm.search.gm = null;
    	
    	vm.players = {};
    	
    	vm.pagination = {};
    	vm.pagination.totalItems = 0;
    	vm.pagination.currentPage = 1;
    	vm.pagination.pageSize = 10;
    	
    	vm.getScenarios();
    }
    
    SearchController.prototype.initFilters = function()
    {
    	var vm = this;
    	
    	vm.$localStorage.search_filters = {};
    	
    	if(angular.isUndefined(vm.$localStorage.search_filters.lowestPlayerLevel)) { vm.$localStorage.search_filters.lowestPlayerLevel = ''; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.highestPlayerLevel)) { vm.$localStorage.search_filters.highestPlayerLevel = ''; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.campaign)) { vm.$localStorage.search_filters.campaign = 'pfs'; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.scenarios)) { vm.$localStorage.search_filters.scenarios = true; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.modules)) { vm.$localStorage.search_filters.modules = true; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.aps)) { vm.$localStorage.search_filters.aps = true; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.quests)) { vm.$localStorage.search_filters.quests = true; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.retired)) { vm.$localStorage.search_filters.retired = false; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.evergreen)) { vm.$localStorage.search_filters.evergreen = false; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.specials)) { vm.$localStorage.search_filters.specials = false; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.sorting)) { vm.$localStorage.search_filters.sorting = vm.data.sortoptions[2]; }
    	if(angular.isUndefined(vm.$localStorage.search_filters.seasons)) { vm.$localStorage.search_filters.seasons = {}; }
    	
    	vm.filters = vm.$localStorage.search_filters;
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
    	if(vm.search.scenario)
    	{
    		query = query + '&search=' + vm.search.scenario;
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
    		console.log(vm.filters.seasons);
    		console.log(vm.filters.seasons.length);
    		
    		angular.forEach(vm.filters.seasons, function(value, key) {
    			if(value == true)
    			{
    				query = query + '&season[]=' + key;
    			}
    		});
    		
    		for (var i = 0; i < vm.filters.seasons.length; ++i)
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
    	if(vm.search.author)
    	{
    		query = query + '&author=' + vm.search.author;
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
    	
    	// Filter: GM
    	if(vm.gm)
    	{
    		query = query + '&gm=' + vm.gm.pfsnumber;
    	}
    	
    	// Filter: Sorting
    	if(vm.filters.sorting)
    	{
    		query = query + '&sorting=' + vm.filters.sorting.key;
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
    
    SearchController.prototype.removeGm = function()
    {
    	var vm = this;
    	
    	vm.gm = null;
    	
    	vm.getScenarios();
    }    
    
    SearchController.prototype.addPlayer = function()
    {
    	var vm = this;

    	if( Object.prototype.toString.call( vm.search.player ) === '[object Object]' ) {
    		vm.people.push(vm.search.player);
			vm.getScenarios();
    	}
    	
		vm.search.player = '';    	
    }

    SearchController.prototype.addGm = function()
    {
    	var vm = this;

    	if( Object.prototype.toString.call( vm.search.gm ) === '[object Object]' ) {
    		vm.gm = vm.search.gm;
    		vm.getScenarios();
    	}
    	
		vm.search.gm = '';
    }
    
    SearchController.prototype.formatPlayersearch = function($model)
    {
    	if($model)
    	{
    		return $model.name + ' - ' + $model.pfsnumber;
    	}
    	
    	return '';
    }
    
    SearchController.prototype.resetFilters = function()
    {
    	var vm = this;
    	
    	delete vm.$localStorage.search_filters;
    	
    	vm.initFilters();
    	vm.getScenarios();
    	
    	$("html, body").animate({ scrollTop: 0 }, 200);    	
    }
})();
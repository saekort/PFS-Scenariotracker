(function(){
    'use strict';

    angular
        .module('admintracker')
        .controller('ScenariosController', ScenariosController );
    
    function ScenariosController($state, $location, $scope, $http)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	
    	vm.scenarios = [];
    	
    	vm.pagination = {};
    	vm.pagination.totalItems = 0;
    	vm.pagination.currentPage = 1;
    	vm.pagination.pageSize = 10;
    	
    	if(typeof vm.main.$storage.user === 'undefined')
    	{
    		// Not logged in, redirect
    		vm.$state.go('dashboard');
    	}
    	
    	vm.getScenarios();
    }
    
    ScenariosController.prototype.getScenarios = function()
    {
    	var vm = this;
    	
    	// Build the pagination string
    	var query = 'rows=15&page=' + vm.pagination.currentPage;
    	query = query + '&orderBy=name&order=asc';
    	
    	// Do not add authors
    	query = query + '&simple';
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'scenarios/simple' + '?' + query).
    	success(function(data, status, headers, config) {
        	// Empty the scenarios currently in memory
        	vm.scenarios = [];
        	
    		// Assign scenarios
    		vm.scenarios = data.rows;
  		  
    		// Assign total found scenarios count
    		vm.pagination.totalItems = data.count;
    	}).
    	error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
    		console.log('ERROR loading scenarios');
    	});
    }
    
    ScenariosController.prototype.changePage = function()
    {
    	var vm = this;
    	vm.getScenarios();
    }
 
})();
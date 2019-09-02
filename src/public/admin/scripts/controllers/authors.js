(function(){
    'use strict';

    angular
        .module('admintracker')
        .controller('AuthorsController', AuthorsController );
    
    function AuthorsController($state, $location, $scope, $http)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	
    	vm.authors = [];
    	
    	vm.pagination = {};
    	vm.pagination.totalItems = 0;
    	vm.pagination.currentPage = 1;
    	vm.pagination.pageSize = 10;
    	
    	if(typeof vm.main.$storage.user === 'undefined')
    	{
    		// Not logged in, redirect
    		vm.$state.go('dashboard');
    	}
    	
    	vm.getAuthors();
    }
    
    AuthorsController.prototype.getAuthors = function()
    {
    	var vm = this;
    	
    	// Build the pagination string
    	var query = 'rows=15&page=' + vm.pagination.currentPage;
    	query = query + '&orderBy=name&order=asc';
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'authors' + '?' + query).
    	success(function(data, status, headers, config) {
        	// Empty the authors currently in memory
        	vm.authors = [];
        	
    		// Assign authors
    		vm.authors = data.rows;
  		  
    		// Assign total found authors count
    		vm.pagination.totalItems = data.count;
    	}).
    	error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
    		console.log('ERROR loading authors');
    	});
    }
    
    AuthorsController.prototype.changePage = function()
    {
    	var vm = this;
    	vm.getAuthors();
    }
    
    AuthorsController.prototype.editAuthor = function(index)
    {
    	console.log('sup');
    	var vm = this;
    	vm.author = vm.authors[index];
    }
 
})();
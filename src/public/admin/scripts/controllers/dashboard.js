(function(){
    'use strict';

    angular
        .module('admintracker')
        .controller('DashboardController', DashboardController );
    
    function DashboardController($state, $location, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.main = $scope.main;
    	
    	console.log(vm.main.$storage.user);
    	
    	if(typeof vm.main.$storage.user === 'undefined' || vm.main.$storage.user.admin == false)
    	{
    		// Not logged in and/or not admin
    		vm.$state.go('error');
    	}
    }
 
})();
(function(){
    'use strict';

    angular
        .module('admintracker')
        .controller('ErrorController', ErrorController );
    
    function ErrorController($scope, $state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.main = $scope.main;
    
    	if(typeof vm.main.$storage.user !== 'undefined' && vm.main.$storage.user.admin === true)
    	{
    		// Logged in and admin, go to dashboard
    		vm.$state.go('dashboard');
    	}
    }
 
})();
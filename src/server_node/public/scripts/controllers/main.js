(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController($state, $location, $http, $scope, $rootScope, $localStorage, trackerConfig)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.trackerConfig = trackerConfig;
    	vm.$storage = $localStorage;
    	
    	// Set Authorization header based on value of token in $storage object
    	$scope.$watch('main.$storage.token', function() {
    		if(typeof(vm.$storage.token) !== 'undefined')
    		{
    			$http.defaults.headers.common = {'Authorization': 'Bearer ' + vm.$storage.token}
    		}
        });
    	
    	// If the injector notices that the user is logged out on the server also log him out locally
    	$scope.$on('Unauthorized', function() {
    		vm.logout();
    	});
    }

    MainController.prototype.logout = function() {
    	var vm = this;
    	
    	delete vm.$storage.token;
    	delete vm.$storage.user;
    	
		vm.$http.defaults.headers.common = {'Authorization': undefined}
    	vm.$state.go('login', {}, {reload: true});
    }
    
})();
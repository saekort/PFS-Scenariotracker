(function(){
    'use strict';

    angular
        .module('admintracker')
        .controller('MainController', MainController );
    
    function MainController($state, $location, $http, $scope, $rootScope, $localStorage, trackerConfig, toastr, $uibModal)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.trackerConfig = trackerConfig;
    	vm.$storage = $localStorage;
    	vm.toastr = toastr;
    	vm.$uibModal = $uibModal;
    	
    	// Set Authorization header based on value of token in $storage object
    	$scope.$watch('main.$storage.token', function() {
    		if(typeof(vm.$storage.token) !== 'undefined') {
    			$http.defaults.headers.common = {'Authorization': 'Bearer ' + vm.$storage.token};
    			vm.checkToken();
    			if(!vm.$storage.user.admin) {
    				// Not an admin, user should not be here
    				vm.toast('error', 'No valid session');
    			}
    		} else {
    			// User should not be here
    			vm.toast('error', 'No valid session');
    		}
        });
    	
    	// If the injector notices that the user is logged out on the server also log him out locally
    	$scope.$on('Unauthorized', function() {
    		if($state.current.name !== 'login') {
    			// Logout, unless we are at the login page
	    		vm.logout();
    		}
    	});
    }
    
    MainController.prototype.logout = function() {
    	var vm = this;
    	
    	delete vm.$storage.token;
    	delete vm.$storage.user;
    	
		vm.$http.defaults.headers.common = {'Authorization': undefined}
		vm.toast('success', 'Logged out');
    	vm.$state.go('login', {}, {reload: true});
    }
    
    MainController.prototype.toast = function(type, text) {
    	var vm = this;
    	
    	if(type === 'info') {
    		vm.toastr.info(text);	
    	} else if(type === 'success') {
    		vm.toastr.success(text);
    	} else if(type === 'error') {
    		vm.toastr.error(text, null);
    	} else if(type === 'warning') {
    		vm.toastr.warning(text);
    	}
    }
    
    MainController.prototype.checkToken = function() {
    	var vm = this;
    	
    	if(typeof(vm.$storage.token) !== 'undefined') {
	    	var expiryTime = jwt_decode(vm.$storage.token).exp;
	    	var currentTime = Math.floor(Date.now() / 1000);
	    	
	    	if(expiryTime < currentTime) {
	    		// Token isn't valid anymore
	    		vm.logout();
	    	}
    	}
    	
    	return true;
    }
    
})();
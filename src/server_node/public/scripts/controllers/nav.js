(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('NavController', NavController );
    
    function NavController($state, $location, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.othermenu = false;
    	vm.profilemenu = false;
    	vm.loading = false;
    	vm.main = $scope.main;
    	
    	$scope.$on('loading-start', function() {
    		vm.loading = true;
    	});
    	
    	$scope.$on('loading-stop', function() {
    		vm.loading = false;
    	});
    }
    
    NavController.prototype.goto = function(state, type, subtype)
    {
    	var vm = this;
    	vm.main.checkToken();
    	if(type == 'pfsnumber') {
    		if(subtype == 'report') {
    			vm.$state.go(state, {pfsNumber: vm.main.$storage.user.pfsnumber, report: 'report'});	
    		} else {
    			vm.$state.go(state, {pfsNumber: vm.main.$storage.user.pfsnumber});
    		}
    	} else {
    		vm.$state.go(state);
    	}
    }
    
    NavController.prototype.getClass = function(path)
    {
    	var vm = this;
    	
    	if(path === '/')
    	{
    		if(vm.$location.path() === '/')
    		{
    			return 'active';
    		}
    		else
    		{
    			return '';
    		}
    	}
    	
        if (vm.$location.path().substr(0, path.length) === path)
        {
            return 'active';
        }
        else
        {
            return '';
        }
    }   
})();
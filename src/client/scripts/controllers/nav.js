(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('NavController', NavController );
    
    function NavController($state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.othermenu = false;
    }

    NavController.prototype.goto = function(state)
    {
    	var vm = this;
    	vm.$state.go(state);
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
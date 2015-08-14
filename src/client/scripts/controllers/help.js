(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('HelpController', HelpController );
    
    function HelpController($state, $location, $modal)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.animate = true;
    	vm.$modal = $modal;
    }
    
    HelpController.prototype.open = function(type)
    {
    	var vm = this;
    	vm.type = type;
    	if(vm.type=='filters')
    	{
    		var modalInstance = vm.$modal.open({
    			animation: vm.animate,
    			templateUrl: 'help_filters.html',
    			controller: 'ModalInstanceController',
    			size: 'lg'
    		});
    	}
    	
    }
    
})();
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
    			controller: 'ModalInstanceController as help',
    			size: 'lg'
    		});
    	}
    	
    	if(vm.type=='search')
    	{
    		var modalInstance = vm.$modal.open({
    			animation: vm.animate,
    			templateUrl: 'help_search.html',
    			controller: 'ModalInstanceController as help',
    			size: 'lg'
    		});
    	}
    	
    	if(vm.type=='report')
    	{
    		var modalInstance = vm.$modal.open({
    			animation: vm.animate,
    			templateUrl: 'help_report.html',
    			controller: 'ModalInstanceController as help',
    			size: 'lg'
    		});
    	}
    	
//    	modalInstance.result.then(function(data) {
//    	      console.log(data);
//    	    });    	
    }
    
})();
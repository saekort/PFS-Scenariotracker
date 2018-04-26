(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('HelpController', HelpController );
    
    function HelpController($state, $location, $uibModal)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.animate = true;
    	vm.$uibModal = $uibModal;
    }
    
    HelpController.prototype.open = function(type)
    {
    	var vm = this;
    	vm.type = type;
    	
    	if(vm.type=='filters')
    	{
    		var modalInstance = vm.$uibModal.open({
    			animation: vm.animate,
    			templateUrl: 'help_filters.html',
    			controller: 'ModalInstanceController as help',
    			resolve: {
    				content: function() {return null;}
    			},    			
    			size: 'lg'
    		});
    	}
    	
    	if(vm.type=='search')
    	{
    		var modalInstance = vm.$uibModal.open({
    			animation: vm.animate,
    			templateUrl: 'help_search.html',
    			controller: 'ModalInstanceController as help',
    			resolve: {
    				content: function() {return null;}
    			},    			
    			size: 'lg'
    		});
    	}
    	
    	if(vm.type=='report')
    	{
    		var modalInstance = vm.$uibModal.open({
    			animation: vm.animate,
    			templateUrl: 'help_report.html',
    			controller: 'ModalInstanceController as help',
    			resolve: {
    				content: function() {return null;}
    			},    			
    			size: 'lg'
    		});
    	} 	
    }
    
})();
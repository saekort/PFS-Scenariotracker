(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ModalInstanceController', ModalInstanceController );
    
    function ModalInstanceController($modalInstance, $scope, character)
    {
    	var vm = this;
    	vm.$scope = $scope;
    	vm.$modalInstance = $modalInstance;
    	
    	if(character)
    	{
    		vm.character = character;
    	}
    }
    
    ModalInstanceController.prototype.close = function()
    {
    	var vm = this;
    	vm.$modalInstance.dismiss();
    }
    
    ModalInstanceController.prototype.deleteCharacter = function()
    {
    	var vm = this;
    	vm.$modalInstance.close(vm.character);
    }    
    
})();
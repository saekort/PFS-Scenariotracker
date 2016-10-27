(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ModalInstanceController', ModalInstanceController );
    
    function ModalInstanceController($uibModalInstance, $scope, character)
    {
    	var vm = this;
    	vm.$scope = $scope;
    	vm.$uibModalInstance = $uibModalInstance;
    	
    	if(character)
    	{
    		vm.character = character;
    	}
    }
    
    ModalInstanceController.prototype.close = function()
    {
    	var vm = this;
    	vm.$uibModalInstance.dismiss();
    }
    
    ModalInstanceController.prototype.deleteCharacter = function()
    {
    	var vm = this;
    	vm.$uibModalInstance.close(vm.character);
    }    
    
})();
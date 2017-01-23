(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ModalInstanceController', ModalInstanceController );
    
    function ModalInstanceController($uibModalInstance, $scope, content)
    {
    	var vm = this;
    	vm.$scope = $scope;
    	vm.$uibModalInstance = $uibModalInstance;
    	
    	vm.content = content;
    }
    
    ModalInstanceController.prototype.close = function()
    {
    	var vm = this;
    	vm.$uibModalInstance.dismiss();
    }
    
    ModalInstanceController.prototype.deleteContent = function()
    {
    	var vm = this;
    	vm.$uibModalInstance.close(vm.content);
    }    
    
})();
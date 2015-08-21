(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ModalInstanceController', ModalInstanceController );
    
    function ModalInstanceController($modalInstance)
    {
    	var vm = this;
    	vm.$modalInstance = $modalInstance;
    }
    
    ModalInstanceController.prototype.close = function()
    {
    	var vm = this;
    	vm.$modalInstance.dismiss();
    }
    
})();
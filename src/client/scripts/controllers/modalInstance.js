(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ModalInstanceController', ModalInstanceController );
    
    function ModalInstanceController($state, $modalInstance)
    {
    	var vm = this;
    	vm.$state = $state;	
    }
    
    ModalInstanceController.prototype.close = function()
    {
    	$modelInstance.dismiss();
    }
    
})();
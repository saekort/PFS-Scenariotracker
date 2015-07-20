(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('RegisterController', RegisterController );
    
    function RegisterController($http, $state, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.playername = "";
    	vm.playernumer = "";
    }
    
    RegisterController.prototype.savePlayer = function()
    {
    	console.log('ik werk!');

    }
    
})();
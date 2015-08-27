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
    	vm.playernumber = "";
    	vm.playeremail = "";
    	vm.playerpassword = "";
    	vm.checkpassword = "";
    }
    
    RegisterController.prototype.savePlayer = function()
    {
    	console.log('ik werk!');
    }
    
})();
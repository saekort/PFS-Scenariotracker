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
    	vm.othersmayreport = false;
    }
    
    RegisterController.prototype.savePlayer = function()
    {
   	
    	var vm = this;
    	var person = {email : vm.playeremail, password : vm.playerpassword, name : vm.playername, pfsnumber : vm.playernumber, report : vm.othersmayreport};
    	
    	console.log(person);
    }
    
})();
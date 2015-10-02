(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ProfileController', ProfileController );
    
    function ProfileController($http, $state, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$http = $http;
    	
    	vm.getPlayer();
    }
    
    ProfileController.prototype.getPlayer = function()
    {
    	var vm = this;
    	vm.playername = "This be playername";
    	vm.playernumber = "123456789";
    }
    
    ProfileController.prototype.savePlayer = function()
    {
   	
    	var vm = this;
    	var person = {email : vm.playeremail, password : vm.playerpassword, name : vm.playername, pfsnumber : vm.playernumber, public : vm.othersmayreport};
    	
    	console.log(person);
    	
    	//TODO, make similar function here as we made for the register page
       
       }
    
})();
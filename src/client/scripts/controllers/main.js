(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController($state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	
    	vm.loggedin = false;
    	
    	vm.checkLogin();
    }
    
    MainController.prototype.checkLogin = function()
    {
    	var vm = this;
    	
    }
 
})();
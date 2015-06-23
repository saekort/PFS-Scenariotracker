(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('MainController', MainController );
    
    function MainController()
    {
    	var vm = this;
    	vm.greeting = "Hallo bitches!";
    	
    	function test()
    	{
    		
    	}
    }
    
    MainController.Prototype.test = function()
    {
    	
    }
    
    // Define getScenarios function, get and return JSON of the service
    
})();
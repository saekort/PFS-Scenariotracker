(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('PasswordrecoverController', PasswordrecoverController );
    
    function PasswordrecoverController($state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	
    	vm.playeremail = '';
    }
 
})();
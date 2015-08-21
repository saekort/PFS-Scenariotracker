(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('PlanController', PlanController );
    
    function PlanController($state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    }
 
})();
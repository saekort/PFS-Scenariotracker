(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('AboutController', AboutController );
    
    function AboutController($state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    }
 
})();
(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('IssuesController', IssuesController );
    
    function IssuesController($state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    }
 
})();
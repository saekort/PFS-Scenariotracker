(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('RegisterController', RegisterController );
    
    function RegisterController($http, $state, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    }   
})();
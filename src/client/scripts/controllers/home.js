(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('HomeController', HomeController );
    
    function HomeController($http, $state, usSpinnerService)
    {
    	this.$state = $state;
    }

    HomeController.prototype.gotoSearch = function()
    {
    	var vm = this;
    	vm.$state.go('search');
    }

    HomeController.prototype.gotoReport = function()
    {
    	var vm = this;
    	vm.$state.go('report');
    }    
})();
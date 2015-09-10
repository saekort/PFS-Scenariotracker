(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('LoginController', LoginController );
    
    function LoginController($state, $location)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	
    	vm.username = '';
    	vm.password = '';
    }
    
    LoginController.prototype.doLogin = function(main)
    {
    	var vm = this;
    	main.loggedin = true;
    	vm.$state.go('report');
    }
 
})();
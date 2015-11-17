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
    	
    	vm.players = [
    	              {name: 'Simon', pfsnumber: '25642', char: 'Wulfric', descr: 'Fighter(6)/Barbarian(1)'},
    	              {name: 'Simon', pfsnumber: '25642', char: 'Assyra', descr: 'Sorcerer(9)'},
    	              {name: 'Simon', pfsnumber: '25642', char: 'Tariq', descr: 'Paladin(1)'},
    	              {name: 'Simon', pfsnumber: '25642', char: 'Norum', descr: 'Hunter(8)'},
    	              {name: 'Simon', pfsnumber: '25642', char: 'Lotus', descr: 'Magus(1)'},
    	              {name: 'Simon', pfsnumber: '25642', char: 'Tomlin', descr: 'Wizard (Illusionist)(3)'}
    	              ];
    	
    	vm.gm1;
    	vm.gm2;
    	vm.gm3;
    	vm.gm4;
    	
    	vm.apl1 = 0;
    	vm.players2 = [{name: 'Alleen', pfsnumber: '1', char: 'McAlleen', descr: 'Expert(1)'}];
    	vm.players3 = [{name: 'Minder alleen', pfsnumber: '1', char: 'McAlleen', descr: 'Expert(1)'}];
    	vm.players4 = [{name: 'Nieske', pfsnumber: '1', char: 'McAlleen', descr: 'Expert(1)'}];
    	
    	vm.selected = null;
    }
 
})();
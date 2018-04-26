(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('PlanController', PlanController );
    
    function PlanController($state, $location, $http, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.main = $scope.main;
    	
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
    	
    	vm.player1 = {name: 'Alleen', pfsnumber: '1', char: 'McAlleen', descr: 'Expert(1)'};
    	vm.player2 = {name: 'Minder alleen', pfsnumber: '1', char: 'McAlleen', descr: 'Expert(1)'};
    	vm.player3 = {name: 'Nieske', pfsnumber: '1', char: 'McAlleen', descr: 'Expert(1)'};
    	
    	vm.selected = null;
    	
    	vm.tables = [];
    	
    	// Testdata
//    	getScenario(Math.floor((Math.random() * 300) + 1));
//    	vm.scenario1 = null;
    	
    	//vm.scenario2 = getScenario(Math.floor((Math.random() * 300) + 1));
    	//vm.scenario3 = getScenario(Math.floor((Math.random() * 300) + 1));
    	
    	vm.tables = [
    	             {number: '01', gm: vm.player1, levelrange: '1-5', scenario: {name: '???'}, players: []},
    	             {number: '02', gm: vm.player2, levelrange: '3-7', scenario: {name: '???'}, players: []},
    	             {number: '03', gm: vm.player3, levelrange: '7-11', scenario: {name: '???'}, players: []},
    	             {number: '04', gm: vm.player1, levelrange: '1-5', scenario: {name: '???'}, players: []},
    	             {number: '05', gm: vm.player2, levelrange: '3-7', scenario: {name: '???'}, players: []},
    	             {number: '06', gm: vm.player3, levelrange: '7-11', scenario: {name: '???'}, players: []},
    	             {number: '07', gm: vm.player1, levelrange: '1-5', scenario: {name: '???'}, players: []},
    	             {number: '08', gm: vm.player2, levelrange: '3-7', scenario: {name: '???'}, players: []},
    	             {number: '09', gm: vm.player3, levelrange: '7-11', scenario: {name: '???'}, players: []}
    	             ];
    	
    	// Get the scenario for each table
    	angular.forEach(vm.tables, function(table, index) {
    		$http.get(vm.main.trackerConfig.apiUrl + 'scenario/id/' + Math.floor((Math.random() * 300) + 1))
    				.then(function(response) {
    	    			table.scenario = response.data[0];
    	    		}, function(response) {
    					table.scenario = {name: '[Server error]'};
    				});
    	});
    	
    	// Get the players for each table
    	angular.forEach(vm.tables, function(table, index) {
    		
    		var nrOfPlayers = Math.floor((Math.random() * 7));
    		console.log('TABLE: ' + table, nrOfPlayers);
    		var i;
    		for(i = 0; i <= nrOfPlayers; i++) {
        		$http.get(vm.main.trackerConfig.apiUrl + 'character/id/' + Math.floor((Math.random() * 707) + 1))
				.then(function(response) {
					console.log(response.data[0]);
	    			table.players.push(response.data[0]);
	    		}, function(response) {
					table.players.push({name: '[Server error]'});
				});
    		}
    	});    	
    }
})();
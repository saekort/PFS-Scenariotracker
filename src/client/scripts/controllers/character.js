(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('CharacterController', CharacterController );
    
    function CharacterController($http, $state, $filter, $location, $scope, usSpinnerService)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$filter = $filter;
    	vm.characters = [];
    	vm.usSpinnerService = usSpinnerService;
    	
    	vm.options = [];
    	vm.options.factions = [	
    	                       	{name: "Dark Archive", code: 'da'},
    	                       	{name: "Grand Lodge", code: 'gl'},
    							{name: "Scarab Sages", code: 'ss'},
    							{name: "Sovereign Court", code: 'sov'},
    							{name: "The Exchange", code: 'te'},
    							{name: "Liberty's Edge", code: 'le'},
    							{name: "Silver Crusade", code: 'sc'}
    							];
    	vm.options.numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    	vm.options.levels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    	vm.options.campaigns = ['PFS', 'CORE'];
    	
    	vm.status = 'overview';
    	vm.character = {};
    	vm.character.name = '';
    	vm.character.number = '';
    	vm.character.class = '';
    	vm.character.level = '';
    	vm.character.faction = '';
    	vm.character.campaign = '';
    	
    	if(!vm.main.player)
    	{
    		// Not logged in, redirect
    		vm.$state.go('search');
    	}
    	
    	vm.getCharacters();
    }
    
    CharacterController.prototype.getCharacters = function()
    {
    	var vm = this;
    	vm.usSpinnerService.spin('spinner-1');
    	
    	vm.$http.get('http://pfs.campaigncodex.com/api/v1/characters?pfsnumber=' + vm.main.player.pfsnumber).
	  	success(function(data, status, headers, config) {
		  // Assign characters to model
		  vm.characters = data;
		  
		  vm.usSpinnerService.stop('spinner-1');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  console.log('ERROR loading characters data');
  		  vm.usSpinnerService.stop('spinner-1');
  	  }); 
    }
    
    CharacterController.prototype.editCharacter = function(index)
    {
    	var vm = this;
    	
    	vm.character.name = vm.characters[index].name;
    	vm.character.number = parseInt(vm.characters[index].number);
    	vm.character.class = vm.characters[index].class;
    	vm.character.level = parseInt(vm.characters[index].level);
    	vm.character.faction = vm.$filter('filter')(vm.options.factions, {code: vm.characters[index].faction})[0];
    	vm.character.campaign = vm.characters[index].campaign;
    	
    	vm.status = 'edit';
    }

    CharacterController.prototype.newCharacter = function()
    {
    	var vm = this;

    	vm.character.name = '';
    	vm.character.number = '';
    	vm.character.class = '';
    	vm.character.level = '';
    	vm.character.faction = '';
    	vm.character.campaign = 'PFS'; 	
    	
    	vm.status = 'new';
    }       
    
    CharacterController.prototype.saveCharacter = function()
    {
    	var vm = this;
    	
    	
    	vm.status = 'overview';
    }   
    
})();
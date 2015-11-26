(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('CharacterController', CharacterController );
    
    function CharacterController($http, $state, $filter, $location, $scope, $modal, usSpinnerService)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$filter = $filter;
    	vm.$modal = $modal;
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
    	vm.character.id = '';
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
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'characters?pfsnumber=' + vm.main.player.pfsnumber).
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
    	
    	vm.character.id = vm.characters[index].id;
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

    	vm.character.id = '';
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

    	// Determine if we are saving or creating
    	if(vm.status == 'new')
    	{
    		// We are creating
    		var post_data = {name: vm.character.name, number: vm.character.number, class: vm.character.class, level: vm.character.level, faction: vm.character.faction.code, campaign: vm.character.campaign};
    	}
    	else
    	{
    		// We are updating
    		var post_data = {id: vm.character.id, name: vm.character.name, number: vm.character.number, class: vm.character.class, level: vm.character.level, faction: vm.character.faction.code, campaign: vm.character.campaign};
    	}
    	
        var req = {
                method: 'POST',
                url: vm.main.trackerConfig.apiUrl + 'character',
                data: $.param(post_data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				console.log('Character saved');
				vm.getCharacters();
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		console.log('ERROR saving content');
	  	});
        
    	vm.status = 'overview';
    }
    
    CharacterController.prototype.confirmDeleteCharacter = function(index)
    {
    	var vm = this;
    	
		var modalInstance = vm.$modal.open({
			animation: true,
			templateUrl: 'confirmDeleteCharacter.html',
			controller: 'ModalInstanceController as confirmDelete',
			resolve: {
				character: function() {return vm.characters[index];}
			},
			size: 'md'
		});
		
    	modalInstance.result.then(function(character) {
	      vm.deleteCharacter(character.id);
	    });    
    }
    
    CharacterController.prototype.deleteCharacter = function(id)
    {
    	var vm = this;

        var req = {
                method: 'DELETE',
                url: vm.main.trackerConfig.apiUrl + 'character',
                data: $.param({id: id}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				console.log('Character deleted');
				vm.getCharacters();
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		console.log('ERROR deleting content');
	  	});
        
    	vm.status = 'overview';
    }
    
})();
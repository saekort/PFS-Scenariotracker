(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('CharacterController', CharacterController );
    
    function CharacterController($http, $state, $filter, $location, $scope, $uibModal, usSpinnerService)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$filter = $filter;
    	vm.$modal = $uibModal;
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
    	vm.options.numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
    	vm.options.levels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    	vm.options.campaigns = ['PFS', 'CORE', 'SFS'];
    	
    	vm.status = 'overview';
    	vm.character = {};
    	vm.character.id = '';
    	vm.character.name = '';
    	vm.character.number = '';
    	vm.character.class = '';
    	vm.character.level = '';
    	vm.character.faction = '';
    	vm.character.campaign = '';
    	vm.character.exp = '';
    	
    	if(typeof vm.main.$storage.user === 'undefined')
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
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'user/characters').
	  	success(function(data, status, headers, config) {
		  // Assign characters to model
		  vm.characters = data;
		  
		  vm.usSpinnerService.stop('spinner-1');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  vm.main.toast('error', 'Error while loading characters');
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
    	vm.character.exp = vm.characters[index].exp;
    	
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
    	vm.character.exp = '0';
    	
    	vm.status = 'new';
    }       
    
    CharacterController.prototype.saveCharacter = function()
    {
    	var vm = this;

    	// Determine if we are saving or creating
    	if(vm.status == 'new')
    	{
    		// We are creating
    		var post_data = {name: vm.character.name, number: vm.character.number, class: vm.character.class, level: vm.character.level, faction: vm.character.faction.code, campaign: vm.character.campaign, exp: vm.character.exp};
    	}
    	else
    	{
    		// We are updating
    		var post_data = {id: vm.character.id, name: vm.character.name, number: vm.character.number, class: vm.character.class, level: vm.character.level, faction: vm.character.faction.code, campaign: vm.character.campaign, exp: vm.character.exp};
    	}
    	
        var req = {
                data: $.param(post_data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
        
        if(vm.character.id) {
            req.method = 'PUT';
            req.url = vm.main.trackerConfig.apiUrl + 'user/characters/' + vm.character.id;
        } else {
        	req.method = 'POST';
        	req.url = vm.main.trackerConfig.apiUrl + 'user/characters';
        }
    	
    	vm.$http(req)
    	.success(function(data, status, headers, config) {
				vm.main.toast('success', 'Character saved');
				vm.getCharacters();
		}).error(function(data, status, headers, config) {
	  		vm.main.toast('error', 'Error while saving character');
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
				content: function() {return vm.characters[index];}
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
            url: vm.main.trackerConfig.apiUrl + 'user/characters/' + id,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };    	
    	
    	vm.$http(req)
    	.success(function(data, status, headers, config) {
			vm.main.toast('success', 'Character deleted');
			vm.getCharacters();
		}).error(function(data, status, headers, config) {
			vm.main.toast('error', 'Error while deleting character');
	  	});
        
    	vm.status = 'overview';
    }
    
})();
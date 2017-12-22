(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('PlayersController', PlayersController );
    
    function PlayersController($state, $location, $http, $scope, $stateParams)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	vm.$stateParams = $stateParams;
    	vm.playerselect = '';

    	vm.player = null;
    	vm.report = false;
    	
    	if($stateParams.report) {
    		vm.report = true;
    		
    		vm.progresstypes = [
        	                    {key: 'pfs', name: 'PFS PC'},
        	                    {key: 'core', name: 'CORE PC'},
        	                    {key: 'pfs_gm', name: 'PFS GM'},
        	                    {key: 'core_gm', name: 'CORE GM'}
        	                    ];
        	vm.reportoptions = [
        			{name: 'Season 0', id: 's0', type: 'scenario', season: 0, game: 'pfs'},
        			{name: 'Season 1', id: 's1', type: 'scenario', season: 1, game: 'pfs'},
        			{name: 'Season 2', id: 's2', type: 'scenario', season: 2, game: 'pfs'},
        			{name: 'Season 3', id: 's3', type: 'scenario', season: 3, game: 'pfs'},
        			{name: 'Season 4', id: 's4', type: 'scenario', season: 4, game: 'pfs'},
        			{name: 'Season 5', id: 's5', type: 'scenario', season: 5, game: 'pfs'},
        			{name: 'Season 6', id: 's6', type: 'scenario', season: 6, game: 'pfs'},
        			{name: 'Season 7', id: 's7', type: 'scenario', season: 7, game: 'pfs'},
        			{name: 'Season 8', id: 's8', type: 'scenario', season: 8, game: 'pfs'},
        			{name: 'Season 9', id: 's9', type: 'scenario', season: 9, game: 'pfs'},
        			{name: 'Modules', id: 'mod', type: 'mod', season: false, game: 'pfs'},
        			{name: 'Adventure paths', id: 'ap', type: 'ap', season: false, game: 'pfs'},
        			{name: 'Other', id: 'other', type: 'other', season: false, game: 'pfs'}
        			];
        	
        	vm.reportoptions_sfs = [
        	        {name: 'Season 1', id: 's1', type: 'scenario', season: 1, game: 'sfs'},
        			{name: 'Modules', id: 'mod', type: 'mod', season: false, game: 'sfs'},
        			{name: 'Adventure paths', id: 'ap', type: 'ap', season: false, game: 'sfs'},
        			{name: 'Other', id: 'other', type: 'other', season: false, game: 'sfs'},
        	        ];
        	
        	vm.reporttype = vm.reportoptions[0];
    	}
    	
    	if($stateParams.pfsNumber) {
    		vm.getPlayer($stateParams.pfsNumber);
    		if($stateParams.report) {
    			vm.getContent($stateParams.pfsNumber);
    		}
    	}
    }
    
    PlayersController.prototype.getPlayer = function(pfsnumber)
    {
    	var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'people/' + pfsnumber + '/profile')
    	.success(function(data, status, headers, config) {
    		vm.player = data;
    	}).error(function(data, status, headers, config) {
    		vm.main.toast('error', 'Error while loading profile');
    	});    	
    }
    
    PlayersController.prototype.getPeople = function(search)
    {
    	var vm = this;
    	
    	return vm.$http.get(vm.main.trackerConfig.apiUrl + 'people?search=' + encodeURIComponent(search) + '&rows=5&page=1').then(
    			function(response){
    				return response.data.rows;
    			});
    }
    
    PlayersController.prototype.selectPlayer = function()
    {
    	var vm = this;
    	
    	if( Object.prototype.toString.call( vm.playerselect ) === '[object Object]' ) {
    		vm.$state.go('players', {pfsNumber: vm.playerselect.pfsnumber});
    	}
    
    	vm.playerselect = '';
    }
    
    PlayersController.prototype.changeReportType = function(type)
    {
    	var vm = this;
    	
		vm.reporttype = type;
		vm.getContent();
    }
    
    PlayersController.prototype.getContent = function(pfsNumber)
    {
    	var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'scenarios/player/' + vm.$stateParams.pfsNumber + '/type/' + vm.reporttype.type + '/game/' + vm.reporttype.game + '/season/' + vm.reporttype.season).
    		success(function(data, status, headers, config) {
    		// Assign scenarios
    		vm.content = data;
    		
    		if(vm.reporttype.game == 'pfs') {
	    		data.forEach(function(content) {
	    			if(typeof content.players[0] !== 'undefined') {
	    				if(content.players[0].played.pfs !== null) {
	    					content.players[0].played.pfs = true;
	    				} else {
	    					content.players[0].played.pfs = false;
	    				}
	    				
	    				if(content.players[0].played.pfs_gm !== null) {
	    					content.players[0].played.pfs_gm = true;
	    				} else {
	    					content.players[0].played.pfs_gm = false;
	    				}
	    				
	    				if(content.players[0].played.core !== null) {
	    					content.players[0].played.core = true;
	    				} else {
	    					content.players[0].played.core = false;
	    				}
	    				
	    				if(content.players[0].played.core_gm !== null) {
	    					content.players[0].played.core_gm = true;
	    				} else {
	    					content.players[0].played.core_gm = false;
	    				}
	    			}
	    		});
    		} else if(vm.reporttype.game == 'sfs') {
    			data.forEach(function(content) {
	    			if(typeof content.players[0] !== 'undefined') {
	    				if(content.players[0].played.sfs !== null) {
	    					content.players[0].played.sfs = true;
	    				} else {
	    					content.players[0].played.sfs = false;
	    				}
	    				
	    				if(content.players[0].played.sfs_gm !== null) {
	    					content.players[0].played.sfs_gm = true;
	    				} else {
	    					content.players[0].played.sfs_gm = false;
	    				}
	    			}
	    		});
    		}
    	}).
  	  	error(function(data, status, headers, config) {
  	  		// called asynchronously if an error occurs
  	  		// or server returns response with an error status.
  	  		vm.main.toast('error', 'Error while getting played info');
  	  	});
    }
    
    PlayersController.prototype.saveScenario = function(scenario_id, state, $index)
    {
    	var vm = this;
    	
    	var method = 'POST';
    	
    	if(!vm.content[$index].players[0].played[state])
    	{
    		method = 'DELETE';
    	}

        var req = {
                method: method,
                url: vm.main.trackerConfig.apiUrl + 'report',
                data: $.param({state: state, pfsNumber: vm.player.pfsnumber, content: scenario_id}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.main.toast('success', 'Played info saved');
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		vm.main.toast('error', 'Error while deleting played info');
	  	});
    }
    
    PlayersController.prototype.checkAll = function()
    {
    	var vm = this;
    	
    	angular.forEach(vm.content, function(value, key) {
    		var type = vm.option.check;
    		
    		if(typeof vm.content[key].players[0] == 'undefined') {
    			value.players = [{id: vm.player.id, pfsnumber: vm.player.pfsnumber}];
    			value.players[0].played = {pfs: null, pfs_gm: null, core: null, core_gm: null};
    		}

    		if(!value.players[0].played[type])
    		{
    			// Only check if not already checked
    			vm.content[key].players[0].played[type] = true;    			
    			
    			// Save it to the server
    			vm.saveScenario(value.id, type, key);
    		}
    		
    	});
    	
    	vm.option.check = '';
    }
    
    PlayersController.prototype.uncheckAll = function()
    {
    	var vm = this;
    	var vm = this;
    	
    	angular.forEach(vm.content, function(value, key) {
    		var type = vm.option.check;
    		
    		if(value.players[0].played[type])
    		{
    			// Only check if not already checked
    			vm.content[key].players[0].played[type] = false;    			
    			
    			// Save it to the server
    			vm.saveScenario(value.id, type, key);
    		}
    		
    	});
    	
    	vm.option.check = '';
    }
    
})();
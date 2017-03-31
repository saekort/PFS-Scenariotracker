(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ReportController', ReportController );
    
    function ReportController($http, $scope, $state, $location, $stateParams)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.playerselect = '';
    	vm.player = {};
    	vm.playerprogress = null;
    	vm.totalplayed = 0;
    	vm.totalavailable = 0;
    	vm.progresstype = null;
    	vm.progresstypes = [
    	                    {key: 'pfs', name: 'PFS PC'},
    	                    {key: 'core', name: 'CORE PC'},
    	                    {key: 'pfs_gm', name: 'PFS GM'},
    	                    {key: 'core_gm', name: 'CORE GM'}
    	                    ];
    	vm.reportoptions = [
    			{name: 'Season 0', id: 's0', type: 'scenario', season: 0},
    			{name: 'Season 1', id: 's1', type: 'scenario', season: 1},
    			{name: 'Season 2', id: 's2', type: 'scenario', season: 2},
    			{name: 'Season 3', id: 's3', type: 'scenario', season: 3},
    			{name: 'Season 4', id: 's4', type: 'scenario', season: 4},
    			{name: 'Season 5', id: 's5', type: 'scenario', season: 5},
    			{name: 'Season 6', id: 's6', type: 'scenario', season: 6},
    			{name: 'Season 7', id: 's7', type: 'scenario', season: 7},
    			{name: 'Season 8', id: 's8', type: 'scenario', season: 8},
    			{name: 'Quests', id: 'quest', type: 'quest', season: false},
    			{name: 'Modules', id: 'mod', type: 'mod', season: false},
    			{name: 'Adventure paths', id: 'ap', type: 'ap', season: false}
    			];
    	vm.overview = {name: '<< Back to overview', id: 'overview'};
    	vm.atOverview = true;
    	vm.reporttype = vm.reportoptions[0];
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.content = false;
    	vm.option = {};
    	vm.option.check = null;
    	
    	if ($stateParams.pfsNumber) {
    		vm.player = vm.getPlayer($stateParams.pfsNumber);
    		vm.getContent($stateParams.pfsNumber);
    	} else if(vm.main.$storage.user) {
    		vm.player = vm.main.$storage.user;
    		vm.selectYourself();
    	}
    }
    
    ReportController.prototype.changeReportType = function(type)
    {
    	var vm = this;
    	
    	if(type == 'overview')
    	{
    		vm.reporttype = 'overview';
    		vm.atOverview = true;
    	}
    	else
    	{
    		vm.reporttype = type;
    		vm.getContent();
    		vm.atOverview = false;
    	}
    }
    
    ReportController.prototype.getPlayer = function(pfsNumber) {
    	var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'people/pfs/' + pfsNumber)
    	.success(function(data, status, headers, config) {
    		vm.player = data;
    	});
    }
    
    ReportController.prototype.getContent = function(pfsNumber)
    {
    	var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'scenarios/player/' + pfsNumber + '/type/' + vm.reporttype.type + '/season/' + vm.reporttype.season).
    		success(function(data, status, headers, config) {
    		// Assign scenarios
    		vm.content = data;
    		
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
    		vm.atOverview = false;
    	}).
  	  	error(function(data, status, headers, config) {
  	  		// called asynchronously if an error occurs
  	  		// or server returns response with an error status.
  	  		vm.main.toast('error', 'Error while getting played info');
  	  	});
    }
  
    ReportController.prototype.getPlayerprogress = function(type)
    {
    }    
    
    ReportController.prototype.saveScenario = function(scenario_id, state, $index)
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
    
    ReportController.prototype.getPeople = function(search)
    {
    	var vm = this;
    	
    	return vm.$http.get(vm.main.trackerConfig.apiUrl + 'people?search=' + encodeURIComponent(search) + '&rows=5&page=1').then(
    			function(response){
    				return response.data.rows;
    			});
    }
    
    ReportController.prototype.selectPlayer = function()
    {
    	var vm = this;
    	
    	if( Object.prototype.toString.call( vm.playerselect ) === '[object Object]' ) {
    		vm.player = vm.playerselect;
    		vm.changeReportType('overview');
    		//vm.getPlayerprogress('pfs');
    	}
    
    	vm.playerselect = '';
    }
    
    ReportController.prototype.selectYourself = function()
    {
    	var vm = this;
    	vm.player = vm.main.$storage.user;
    	
    	vm.changeReportType('overview');
    	//vm.getPlayerprogress('pfs');
    }    
    
    ReportController.prototype.formatPlayersearch = function($model)
    {
    	if($model)
    	{
    		return $model.name + ' - ' + $model.pfsnumber;
    	}
    	
    	return '';
    }
    
    ReportController.prototype.checkAll = function()
    {
    	var vm = this;
    	
    	angular.forEach(vm.content, function(value, key) {
    		var type = vm.option.check;
    		
    		if(typeof vm.content[key].players[0] == 'undefined') {
    			console.log('We got undefined');
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
    }
    
    ReportController.prototype.uncheckAll = function()
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
    }
})();
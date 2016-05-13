(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ReportController', ReportController );
    
    function ReportController($http, $scope, $state, $location, usSpinnerService)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.playerselect = '';
    	vm.player = null;
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
    			{name: 'Season 0', id: 's0'},
    			{name: 'Season 1', id: 's1'},
    			{name: 'Season 2', id: 's2'},
    			{name: 'Season 3', id: 's3'},
    			{name: 'Season 4', id: 's4'},
    			{name: 'Season 5', id: 's5'},
    			{name: 'Season 6', id: 's6'},
    			{name: 'Season 7', id: 's7'},
    			{name: 'Season 8', id: 's8'},
    			{name: 'Modules', id: 'mod'},
    			{name: 'Adventure paths', id: 'ap'}
    			];
    	vm.overview = {name: '<< Back to overview', id: 'overview'};
    	vm.atOverview = true;
    	vm.reporttype = vm.overview;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.usSpinnerService = usSpinnerService;
    	vm.content = false;
    	vm.option = {};
    	vm.option.check = null;
    	
    	if(vm.main.$storage.player)
    	{
    		vm.selectYourself();
    	}
    }
    
    ReportController.prototype.changeReportType = function(type)
    {
    	var vm = this;
    	
    	if(type == 'overview')
    	{
    		vm.reporttype = 'overview';
    		vm.getPlayerprogress('pfs');
    		vm.atOverview = true;
    	}
    	else
    	{
    		vm.reporttype = type;
    		vm.getContent();
    		vm.atOverview = false;
    	}
    }
    
    ReportController.prototype.getContent = function()
    {
    	var vm = this;
    	
    	vm.usSpinnerService.spin('spinner-1');
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'reportscenarios' + '?type=' + vm.reporttype.id + '&pfsnumber=' + vm.player.pfsnumber).
    		success(function(data, status, headers, config) {
    		// Assign scenarios
    		vm.content = data;
    		vm.atOverview = false;
  		  	vm.usSpinnerService.stop('spinner-1');
    	}).
  	  	error(function(data, status, headers, config) {
  	  		// called asynchronously if an error occurs
  	  		// or server returns response with an error status.
  	  		console.log('ERROR loading content');
  	  		vm.usSpinnerService.stop('spinner-1');
  	  	});
    }
  
    ReportController.prototype.getPlayerprogress = function(type)
    {
    	var vm = this;
    	
    	vm.usSpinnerService.spin('spinner-1');
    	
    	var index = 0;
    	
    	for(var i = 0, len = vm.progresstypes.length; i < len; i++) {
    	    if (vm.progresstypes[i].key == type) {
    	        index = i;
    	        break;
    	    }
    	}
    	
    	vm.progresstype = vm.progresstypes[index]; 
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'playerprogress' + '?pfsnumber=' + vm.player.pfsnumber + '&type=' + type).
    		success(function(data, status, headers, config) {
    		// Assign scenarios
    		vm.playerprogress = data;

    		vm.totalplayed = 0;
    		vm.totalavailable = 0;
    		for (var key in vm.playerprogress) {
    			if(vm.playerprogress.hasOwnProperty(key))
    			{
        			vm.totalplayed += vm.playerprogress[key].completed;
        			vm.totalavailable += vm.playerprogress[key].total;    				
    			}
    		}
    		
  		  	vm.usSpinnerService.stop('spinner-1');
    	}).
  	  	error(function(data, status, headers, config) {
  	  		// called asynchronously if an error occurs
  	  		// or server returns response with an error status.
  	  		console.log('ERROR loading content');
  	  		vm.usSpinnerService.stop('spinner-1');
  	  	});
    }    
    
    ReportController.prototype.saveScenario = function(scenario_id, state, $index)
    {
    	var vm = this;
    	
    	var method = 'POST';
    	
    	if(!vm.content[$index].state[state])
    	{
    		method = 'DELETE';
    	}

        var req = {
                method: method,
                url: vm.main.trackerConfig.apiUrl + 'reportscenario',
                data: $.param({state: state, pfsnumber: vm.player.pfsnumber, scenario: scenario_id}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
		}).
	  	error(function(data, status, headers, config) {
	  		// called asynchronously if an error occurs
	  		// or server returns response with an error status.
	  		console.log('ERROR saving content');
	  	});
    }
    
    ReportController.prototype.getPeople = function(search)
    {
    	var vm = this;
    	
    	return vm.$http.get(vm.main.trackerConfig.apiUrl + 'people?search=' + encodeURIComponent(search)).then(
    			function(response){
    				return response.data;
    			});
    }
    
    ReportController.prototype.selectPlayer = function()
    {
    	var vm = this;
    	
    	if( Object.prototype.toString.call( vm.playerselect ) === '[object Object]' ) {
    		vm.player = vm.playerselect;
    		console.log(vm.player);
    		vm.changeReportType('overview');
    		vm.getPlayerprogress('pfs');
    	}
    
    	vm.playerselect = '';
    }
    
    ReportController.prototype.selectYourself = function()
    {
    	var vm = this;
    	vm.player = vm.main.$storage.player;
    	
    	vm.changeReportType('overview');
    	vm.getPlayerprogress('pfs');
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
    		
    		if(!value.state[type])
    		{
    			// Only check if not already checked
    			vm.content[key].state[type] = true;    			
    			
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
    		
    		if(value.state[type])
    		{
    			// Only check if not already checked
    			vm.content[key].state[type] = false;    			
    			
    			// Save it to the server
    			vm.saveScenario(value.id, type, key);
    		}
    	});
    }    
})();
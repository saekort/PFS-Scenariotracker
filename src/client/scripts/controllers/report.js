(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ReportController', ReportController );
    
    function ReportController($http, $state, usSpinnerService)
    {
    	var vm = this;
    	vm.playerselect = '';
    	vm.player = {name: 'Simon', pfsnumber: '25642'};
    	vm.reportoptions = [
    			{name: 'Season 0', id: 's0'}, 
    			{name: 'Season 1', id: 's1'},
    			{name: 'Season 2', id: 's2'},
    			{name: 'Season 3', id: 's3'},
    			{name: 'Season 4', id: 's4'},
    			{name: 'Season 5', id: 's5'},
    			{name: 'Season 6', id: 's6'},
    			{name: 'Season 7', id: 's7'},		
    			//{name: 'Modules', id: 'mod'},
    			//{name: 'Adventure paths', id: 'ap'}
    			];
    	vm.overview = {name: '<< Back to overview', id: 'overview'};
    	vm.atOverview = true;
    	vm.reporttype = vm.overview;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.usSpinnerService = usSpinnerService;
    	vm.content = false;
    	vm.getContent();
    }
    
    ReportController.prototype.changeReportType = function(type)
    {
    	var vm = this;
    	
    	if(type == 'overview')
    	{
    		vm.reporttype = 'overview';
    		vm.getContent();
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
    	
    	vm.$http.get('http://pfs.campaigncodex.com/api/v1/reportscenarios' + '?type=' + vm.reporttype.id + '&pfsnumber=' + vm.player.pfsnumber).
    		success(function(data, status, headers, config) {
    		// Assign scenarios
    		vm.content = data;
  		  	vm.usSpinnerService.stop('spinner-1');
    	}).
  	  	error(function(data, status, headers, config) {
  	  		// called asynchronously if an error occurs
  	  		// or server returns response with an error status.
  	  		console.log('ERROR loading content');
  	  		vm.usSpinnerService.stop('spinner-1');
  	  	});
    }
    
    ReportController.prototype.saveScenario = function(scenario_id, state)
    {
    	var vm = this;
    	
        var req = {
                method: 'POST',
                url: 'http://pfs.campaigncodex.com/api/v1/reportscenario',
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
    
    ReportController.prototype.gotoHome = function()
    {
    	var vm = this;
    	vm.$state.go('home');
    }    
    
})();
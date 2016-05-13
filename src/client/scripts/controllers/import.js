(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ImportController', ImportController );
    
    function ImportController($state, $location, $http, usSpinnerService, $scope)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	vm.usSpinnerService = usSpinnerService;
    	vm.log = '';
    	vm.pc_data = '';
    	vm.gm_data = '';
    	
    	ImportController.prototype.process = function(type) {
    		var vm = this;
    		vm.log = '<p>Starting processing, please stand by</p>';
    		if(type == 'pc') {
    			if(this.isJSON(vm.pc_data)) {
    				vm.log += '<p class="alert alert-success">Input is a valid data format!</p>';
    				var data = angular.fromJson(vm.pc_data);
    			} else {
    				vm.log += '<p class="alert alert-danger">Input is not a valid data format! Aborting import.</p>';
    			}
    		} else {
    			if(this.isJSON(vm.gm_data)) {
    				vm.log += '<p class="alert alert-success">Input is a valid data format!</p>';
    				var data = angular.fromJson(vm.gm_data);
    			} else {
    				vm.log += '<p class="alert alert-danger">Input is not a valid data format! Aborting import.</p>';
    			}
    		}
    		
    		vm.log += '<p>Splitting into sessions and handling each session</p>';
    		
    		// Start going over all entries
    		angular.forEach(data, function(value, key) {
    			var result = {};
        		vm.log += '<pre>';
        		vm.log += 'Raw input: ';
        		vm.log += JSON.stringify(value);
        		vm.log += '<hr>';
        		
        		if(typeof value.date !== 'undefined')
        		{
        			vm.log += '<p>Found a potential <strong>played at date</strong><br>';
        			vm.log += value.date;
        			vm.log += ' => ';
        			vm.log += value.date.slice(0,10);
        			vm.log += '</p>';
        			result.played_at = value.date.slice(0,10);
        		}
        		
        		if(typeof value.PFSNumber !== 'undefined')
        		{
        			vm.log += '<p>Found a potential <strong>character number</strong><br>';
        			vm.log += value.PFSNumber;
        			vm.log += ' => ';
        			var charlocation = value.PFSNumber.indexOf('-') + 1;
        			vm.log += value.PFSNumber.slice(charlocation);
        			vm.log += '</p>';
        			
        			result.character = value.PFSNumber.slice(charlocation);
        		}
        		
        		if(typeof value.campaign !== 'undefined')
        		{
        			vm.log += '<p>Found a potential <strong>campaign type</strong><br>';
        			vm.log += value.campaign;
        			vm.log += ' => ';
        			
        			if(value.campaign == 'PFC')
        			{
        				vm.log += 'CORE';
        				result.campaign = 'CORE';
        			} else {
        				vm.log += 'PFS';
        				result.campaign = 'PFS';
        			}
        			
        			vm.log += '</p>';
        		}
        		
        		if(typeof value.Scenario !== 'undefined')
        		{
        			vm.log += '<p>Found a potential <strong>content</strong><br>';
        			vm.log += value.Scenario;
        			vm.log += '<br>Determining type of content...<br>';
        			
        			if(value.Scenario.slice(0,2) == 'AP') {
        				vm.log += 'Type => Adventure Path';
        				result.type = 'ap';
        			} else if(value.Scenario.slice(0,1) == '#') {
        				vm.log += 'Type => Scenario';
        				result.type = 'scenario';
        			} else {
        				vm.log += 'Type => Module (guessing)';
        				result.type = 'mod';
        			}
        		}
        		
        		vm.log += '<p>Ignoring any additional parameters'
        		
        		vm.log += '<p>Here is what we managed to conclude from this</p>';
        		
        		vm.log += JSON.stringify(result);
        		
        		vm.log += '</pre>';
    		})
    	}
    	
    	ImportController.prototype.isJSON = function(str) {
    		var vm = this;
    		
    		vm.log += '<p>Validating input...</p>';
    		
    		try {
    		    JSON.parse(str);
    		} catch (e) {
    		    return false;
    		}
    		
    		return true;
    	}
    }
 
})();
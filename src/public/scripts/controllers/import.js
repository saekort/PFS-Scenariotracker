(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ImportController', ImportController );
    
    function ImportController($state, $location, $http, usSpinnerService, $scope, $q, $timeout, $interval)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.$timeout = $timeout;
    	vm.$interval = $interval;
    	vm.$q = $q;
    	vm.main = $scope.main;
    	vm.usSpinnerService = usSpinnerService;
    	vm.log = '';
    	vm.jsondata = '';
    	vm.importing = false;
    	vm.data = [];
    	vm.resolved = [];
    	vm.characters = [];
    	vm.progressbar = [];
		vm.progressbar.progress = 0;
		vm.progressbar.max = 0;
    	
		vm.getCharacters();
    }
    
	ImportController.prototype.process = function() {
		var vm = this;
		
		// Reset any importing done before
		vm.log = '';
		vm.importing = false;
		vm.resolved = [];
		vm.progressbar.progress = 0;
		vm.progressbar.max = 0;
		
		vm.log = '<p>Starting processing, please stand by</p>';
		if(this.isJSON(vm.jsondata)) {
			vm.log += '<p class="alert alert-success">Input is a valid data format!</p>';
			vm.main.toast('success', 'Starting import');
			var data = angular.fromJson(vm.jsondata);
			vm.importing = true;
		} else {
			vm.log += '<p class="alert alert-danger">Input is not a valid data format! Aborting import.</p>';
			vm.main.toast('error', 'Data format is not valid, aborting import');
			
			return false;
		}
		
		vm.progressbar.max = data.length;
		
		vm.log += '<p>Splitting into sessions and handling each session</p>';
		
		var result = [];
		
		// Start going over all entries
		angular.forEach(data, function(value, key) {
			result[key] = {};
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
    			result[key].played_at = value.date.slice(0,10);
    		}
    		
    		if(typeof value.PFSNumber !== 'undefined')
    		{
    			vm.log += '<p>Found a potential <strong>character number</strong><br>';
    			vm.log += value.PFSNumber;
    			vm.log += ' => ';
    			var charlocation = value.PFSNumber.indexOf('-') + 1;
    			vm.log += value.PFSNumber.slice(charlocation);
    			vm.log += '</p>';
    			
    			result[key].character = value.PFSNumber.slice(charlocation);
    		}
    		
    		if(typeof value.campaign !== 'undefined')
    		{
    			vm.log += '<p>Found a potential <strong>campaign type</strong><br>';
    			vm.log += value.campaign;
    			vm.log += ' => ';
    			
    			if(value.campaign == 'PFC')
    			{
    				vm.log += 'CORE';
    				result[key].campaign = 'CORE';
    			} else {
    				vm.log += 'PFS';
    				result[key].campaign = 'PFS';
    			}
    			
    			vm.log += '</p>';
    		}
    		
    		if(typeof value.role !== 'undefined')
    		{    		
    			vm.log += '<p>Found a potential <strong>role</strong><br>';
    			vm.log += value.role;
    			vm.log += ' => ';
    			
        		if(value.role === 'GM')
    			{
        			vm.log += 'GM';
        			result[key].role = 'GM';
    			} else {
    				vm.log += 'PC';
    				result[key].role = 'PC';
    			}
        		
        		vm.log += '</p>';
    		}
    		
    		if(typeof value.PFSNumber !== 'undefined') {
    			result[key].pfsnumber = value.PFSNumber.substr(0, value.PFSNumber.indexOf("-"));
    		}
    		
    		if(typeof value.ScenarioName !== 'undefined') {
    			vm.log += '<p>Found a potential <strong>content</strong><br>';
    			vm.log += value.ScenarioName;
    			vm.log += '<br>Determining type of content...<br>';

    			if(value.season !== '') {
    				// We have a season
    				if(value.scenario !== '') {
    					// We have a scenario number
    					// Season + number == bingo
    					result[key].type = 'scenario';
    					result[key].importcontent = value.season + '-' + value.scenario;
    					result[key].ignore = false;
    				}
    			} else if(value.ScenarioName.slice(0,2) == 'AP') {
    				result[key].type = 'ap';
    				result[key].importcontent = value.ScenarioName.match(/\d+/)[0];
    				result[key].ignore = false;
    			} else {
    				// Module or quest or special without season/scenario note
    				result[key].type = 'Unknown';
    				result[key].importcontent = 'IGNORED';
    				result[key].ignore = true;
    			}
    			
//    			//TODO: This only catches 90%
//    			if(value.ScenarioName.slice(0,2) == 'AP') {
//    				vm.log += 'Type => Adventure Path';
//    				result[key].type = 'ap';
//    				result[key].importcontent = value.ScenarioName.slice(7).replace(' (RPG)', '');
//    				vm.log += '<p>Setting content match string to: ' + value.ScenarioName.slice(7).replace(' (RPG)', '') + '</p>';
//    			} else if(value.ScenarioName.slice(0,1) == '#') {
//    				vm.log += 'Type => Scenario';
//    				result[key].type = 'scenario';
//    				result[key].importcontent = value.ScenarioName.replace(' (RPG)', '');
//    				vm.log += '<p>Setting content match string to: ' + value.ScenarioName.replace(' (RPG)', '') + '</p>';
//    			} else if(value.ScenarioName.indexOf('Special') > -1) {
//    				vm.log += 'Type => Scenario (based on the word special)';
//    				result[key].type = 'scenario';
//    				result[key].importcontent = value.ScenarioName.replace(' (RPG)', '');
//    				vm.log += '<p>Setting content match string to: ' + value.ScenarioName.replace(' (RPG)', '') + '</p>';
//    			} else {
//    				vm.log += 'Type => Module (guessing)';
//    				result[key].type = 'mod';
//    				result[key].importcontent = value.ScenarioName.replace(' (RPG)', '');
//    				vm.log += '<p>Setting content match string to: ' + value.ScenarioName.replace(' (RPG)', '') + '</p>';
//    			}
    			
    			vm.log += '</p>';
    		}
    		
    		vm.log += '<p>Ignoring any additional values';
    		
    		vm.log += '</pre>';
		})
		
		vm.log += '<p>This is all the data we were able to scrape together:</p>';
		vm.log += JSON.stringify(result);
		
		vm.data = result;
		vm.resolved = vm.data;
		
		vm.$timeout(function() {
			// Try to resolve stuff
			var count = 0;
			vm.$interval(function(count) {
				if(!vm.data[count].ignore) {
					vm.resolveContent(vm.data[count]).then(function(result) {
						vm.resolved[count].tracker = result;
						vm.progressbar.progress++;
					});
				} else {
					vm.resolved[count].tracker = 'IGNORED';
				}
			},500, vm.data.length);
		}, 1000);
	}
	
	ImportController.prototype.resolveContent = function(content) {
		var vm = this;
		
		var def = vm.$q.defer();
		console.log(content);
		var req = {
	        method: 'POST',
	        url: vm.main.trackerConfig.apiUrl + 'report/import',
	        data: $.param(content),
	        headers: {
	            'Content-Type': 'application/x-www-form-urlencoded'
	        }
		};
		vm.$http(req).then(function(data, status, headers, config) {
			def.resolve(data.data);
		}).catch(function(data, status, headers, config) {
			var result = 'ERROR';
			def.resolve(result);
		});
		return def.promise;
	}
	
	ImportController.prototype.getCharacters = function() {
		var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'user/characters').
	  	success(function(data, status, headers, config) {
		  // Assign characters to model
		  vm.characters = data;
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		vm.main.toast('error', 'Error loading characters');
  		  vm.usSpinnerService.stop('spinner-1');
  	  }); 
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
	
	ImportController.prototype.getCharacterByNumber = function(id) {
		var vm = this;
		
		for (var i = 0; i < vm.characters.length; i++) {
			if(vm.characters[i].number == id) {
				return vm.characters[i].name;
			}
		}
		
		return 'Unknown';
	}
 
})();
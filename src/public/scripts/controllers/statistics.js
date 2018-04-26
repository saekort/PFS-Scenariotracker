(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('StatisticsController', StatisticsController );
    
    function StatisticsController($http, $state, $location, $scope, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$location = $location;
    	vm.$http = $http;
    	vm.main = $scope.main;
    	vm.usSpinnerService = usSpinnerService;
    	vm.lastupdated = 'unknown';
    	
    	vm.statistics = [];
    	vm.statistics.totals = [];
    	vm.statistics.totals.players = '?';
    	vm.statistics.totals.countries = '?';
    	vm.statistics.totals.sessions = '?';
    	vm.statistics.totals.characters = '?';
    	vm.statistics.played_most;
    	vm.statistics.played_least;
    	vm.statistics.season;
    	vm.statistics.evergreen;
    	vm.statistics.player_complete_pfs;
    	vm.statistics.gm_complete_pfs;
    	vm.statistics.player_complete_core;
    	vm.statistics.gm_complete_core;
    	
    	vm.getTotals();
    	vm.getStatistic('played_most');
    	vm.getStatistic('evergreen');
    	vm.getStatistic('player_complete_pfs');
    	vm.getStatistic('gm_complete_pfs');
    	vm.getStatistic('player_complete_core');
    	vm.getStatistic('gm_complete_core');
    }
    
    StatisticsController.prototype.getTotals = function()
    {
    	var vm = this;
    	
    	var query = 'type=totals';
    	
    	// Get the special totals statistic
    	// Number info
    	// 1: Players
    	// 2: Countries
    	// 3: Sessions
    	// 4: Characters
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'statistics' + '?' + query).
  	  	  success(function(data, status, headers, config) {
  		  // Assign statistics
  		  vm.statistics.totals.players = data[0];
  		  vm.statistics.totals.countries = data[1];
  		  vm.statistics.totals.sessions = data[2];
  		  vm.statistics.totals.characters = data[3];
  		  
  		  // Update the last updated on text
  		  if(typeof type !== 'undefined' && type === 'played_most')
  		  {
  			  for (var key in vm.statistics.played_most)
  			  {
  				  vm.lastupdated = vm.statistics.played_most[key].created_at;
  				  break;
  			  }
  		  }
  		  
  		  vm.usSpinnerService.stop('spinner-1');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  console.log('ERROR loading statistics');
  		  vm.usSpinnerService.stop('spinner-1');
  	  });
    }    
    
    StatisticsController.prototype.getStatistic = function(type)
    {
    	var vm = this;
    	
    	var query = 'type=' + type;
    	
    	// Get a statistic by type
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'statistics' + '?' + query).
  	  	  success(function(data, status, headers, config) {
  		  // Assign statistic
  		  vm.statistics[type] = data;
  		  
  		  // Update the last updated on text
  		  if(typeof type != 'undefined' && type == 'played_most')
  		  {
  			  for (var key in vm.statistics.played_most)
  			  {
  				  vm.lastupdated = vm.statistics.played_most[key].created_at;
  				  break;
  			  }
  		  }
  		  
  		  vm.usSpinnerService.stop('spinner-1');
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  console.log('ERROR loading statistics');
  		  vm.usSpinnerService.stop('spinner-1');
  	  });
    }
})();
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
    	
//    	vm.player = {
//    			name: 'Simonicus',
//    			pfsnumber: 24652,
//    			country: 'nl',
//    			public: 1,
//				public_characters: 0,
//    			characters: [
//    			             {name: 'Bob', level: 5, faction: 'da', campaign: 'CORE'},
//    			             {name: 'Jane', level: 7, faction: 'gl', campaign: 'PFS'},
//    			             {name: 'Wulfric', level: 2, faction: 'sov', campaign: 'PFS'},
//    			             {name: 'Storm', level: 1, faction: 'sc', campaign: 'CORE'}
//    			             ],
//    			totals: {pfs: 143, pfs_gm: 68, core: 4, core_gm: 3},
//    			progression: [
//    			              {name: 'Season 0', total: 29, pfs: 16, pfs_gm: 13, core: 6, core_gm: 8},
//    			              {name: 'Season 1', total: 23, pfs: 12, pfs_gm: 8, core: 2, core_gm: 3},
//    			              {name: 'Season 2', total: 24, pfs: 6, pfs_gm: 13, core: 6, core_gm: 8},
//    			              {name: 'Season 3', total: 19, pfs: 19, pfs_gm: 8, core: 2, core_gm: 3},
//    			              {name: 'Season 4', total: 21, pfs: 7, pfs_gm: 13, core: 6, core_gm: 8},
//    			              {name: 'Season 5', total: 23, pfs: 15, pfs_gm: 8, core: 2, core_gm: 3},
//    			              {name: 'Season 6', total: 22, pfs: 16, pfs_gm: 13, core: 6, core_gm: 8},
//    			              {name: 'Season 7', total: 20, pfs: 12, pfs_gm: 8, core: 2, core_gm: 3},
//    			              {name: 'Season 8', total: 8, pfs: 0, pfs_gm: 13, core: 6, core_gm: 8},
//    			              {name: 'Modules', total: 66, pfs: 23, pfs_gm: 3, core: 2, core_gm: 3},
//    			              {name: 'APs', total: 110, pfs: 67, pfs_gm: 23, core: 6, core_gm: 8}
//    			              ]
//    		};
    	
    	if($stateParams.pfsNumber) {
    		vm.getPlayer($stateParams.pfsNumber);	
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
    
})();
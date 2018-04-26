(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('GroupController', GroupController );
    
    function GroupController($http, $state, $filter, $location, $scope, $uibModal, $httpParamSerializer)
    {
    	var vm = this;
    	vm.main = $scope.main;
    	vm.$http = $http;
    	vm.$state = $state;
    	vm.$location = $location;
    	//vm.$stateParams = $stateParams;
    	vm.$filter = $filter;
    	vm.$modal = $uibModal;
    	vm.$httpParamSerializer = $httpParamSerializer;
    	
    	vm.group = {};
    	vm.group.id = null;
    	vm.group.name = '';
    	
    	vm.userPermissions = [{name: 'Read', code: 'read'}, {name: 'Update', code: 'update'}];
    	
    	vm.groups = [];
    	vm.status = 'overview';
    	vm.playerselect = '';
    	
    	if(typeof vm.main.$storage.user === 'undefined')
    	{
    		// Not logged in, redirect
    		vm.$state.go('search');
    	}
    	
    	vm.getGroups();
    }
    
    GroupController.prototype.getGroups = function()
    {
    	var vm = this;
    	
    	vm.$http.get(vm.main.trackerConfig.apiUrl + 'user/groups').
	  	success(function(data, status, headers, config) {
		  // Assign groups to model
		  vm.groups = data;
		  
  	  }).
  	  error(function(data, status, headers, config) {
  	    // called asynchronously if an error occurs
  	    // or server returns response with an error status.
  		  vm.main.toast('error', 'Error while loading groups');
  	  }); 
    }
    
    GroupController.prototype.editGroup = function(index)
    {
    	var vm = this;
    	vm.group = vm.groups[index];
    	//vm.group.id = vm.groups[index].id;
    	//vm.group.name = vm.groups[index].name;
    	
    	vm.status = 'edit';
    }
    
    GroupController.prototype.newGroup = function()
    {
    	var vm = this;

    	vm.group.id = null;
    	vm.group.name = '';
    	vm.group.members = [];
    	
    	vm.status = 'new';
    }
    
    GroupController.prototype.saveGroup = function()
    {
    	var vm = this;

    	// Grab the pfsnumbers of the members
    	var members = [];
    	for(var i=0; i < vm.group.members.length; i++) {
    		members.push(vm.group.members[i].pfsnumber);
    	}
    	
    	// Determine if we are saving or creating
    	if(vm.status == 'new')
    	{
    		// We are creating
    		var data = {name: vm.group.name, members: members};
    	}
    	else
    	{
    		// We are updating
    		var data = {id: vm.group.id, name: vm.group.name, members: members};
    	}
    	
        var req = {
            data: vm.$httpParamSerializer(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
        
        if(vm.group.id) {
            req.method = 'PUT';
            req.url = vm.main.trackerConfig.apiUrl + 'user/groups/' + vm.group.id;
        } else {
        	req.method = 'POST';
        	req.url = vm.main.trackerConfig.apiUrl + 'user/groups';
        }
    	
    	vm.$http(req).
			success(function(data, status, headers, config) {
				vm.main.toast('success', 'Group saved');
				vm.getGroups();
				vm.toOverview();
		}).
	  	error(function(data, status, headers, config) {
	  		vm.main.toast('error', 'Error while saving group');
	  		vm.getGroups();
	  		vm.toOverview();
	  	});
    }
    
    GroupController.prototype.confirmDeleteGroup = function(index)
    {
    	var vm = this;

		var modalInstance = vm.$modal.open({
			animation: true,
			templateUrl: 'confirmDeleteGroup.html',
			controller: 'GroupModalInstanceController as confirmDelete',
			resolve: {
				content: function() {return vm.groups[index];}
			},
			size: 'md'
		});
		
		modalInstance.result.then(function(group) {
		  vm.deleteGroup(group.id);
		});    
    }
    
    GroupController.prototype.deleteGroup = function(id)
    {
    	var vm = this;
    	
        var req = {
                method: 'DELETE',
                url: vm.main.trackerConfig.apiUrl + 'user/groups/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };    	
    	
    	vm.$http(req)
    	.success(function(data, status, headers, config) {
			vm.main.toast('success', 'Group deleted');
			vm.getGroups();
		}).error(function(data, status, headers, config) {
			vm.main.toast('error', 'Error while deleting group');
	  	});
        
    	vm.toOverview();
    }
    
    GroupController.prototype.removeMember = function(member)
    {
    	var vm = this;
    	vm.group.members.splice(vm.group.members.indexOf(member), 1);
    }
    
    GroupController.prototype.toOverview = function()
    {
    	var vm = this;
    	
    	vm.status = 'overview';
    }
    
    GroupController.prototype.getPeople = function(search)
    {
    	var vm = this;
    	
    	return vm.$http.get(vm.main.trackerConfig.apiUrl + 'people?search=' + encodeURIComponent(search) + '&rows=5&page=1').then(
    			function(response){
    				return response.data.rows;
    			});
    }
    
    GroupController.prototype.selectPlayer = function()
    {
    	var vm = this;
    	
    	if( Object.prototype.toString.call( vm.playerselect ) === '[object Object]' ) {
    		vm.group.members.push(vm.playerselect);
    	}
    
    	vm.playerselect = '';
    }
    
})();

(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('GroupModalInstanceController', GroupModalInstanceController );
    
    function GroupModalInstanceController($uibModalInstance, $scope, content)
    {
    	var vm = this;
    	vm.$scope = $scope;
    	vm.$uibModalInstance = $uibModalInstance;
    	
    	if(content)
    	{
    		vm.content = content;
    	}
    }
    
    GroupModalInstanceController.prototype.close = function()
    {
    	var vm = this;
    	vm.$uibModalInstance.dismiss();
    }
    
    GroupModalInstanceController.prototype.deleteGroup = function()
    {
    	var vm = this;
    	vm.$uibModalInstance.close(vm.content);
    }
    
})();
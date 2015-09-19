(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('RegisterController', RegisterController );
    
    function RegisterController($http, $state, usSpinnerService)
    {
    	var vm = this;
    	vm.$state = $state;
    	vm.$http = $http;
    	vm.playername = "";
    	vm.playernumber = "";
    	vm.playeremail = "";
    	vm.checkemail= "";
    	vm.playerpassword = "";
    	vm.checkpassword = "";
    	vm.othersmayreport = false;
    }
    
    RegisterController.prototype.savePlayer = function()
    {
   	
    	var vm = this;
    	var person = {email : vm.playeremail, password : vm.playerpassword, name : vm.playername, pfsnumber : vm.playernumber, public : vm.othersmayreport};
    	
    	console.log(person);

//      	var method = 'POST';
//      	
//      	var req = {
//                method: method,
//                url: 'http://pfs.campaigncodex.com/api/v1/person',
//                data: $.param({pfsnumber : vm.playernumber, name : vm.playername, password : vm.playerpassword, public : vm.othersmayreport, email : vm.playeremail}),
//                headers: {
//                    'Content-Type': 'application/x-www-form-urlencoded'
//                }
//            };    	
//    	
//    	vm.$http(req).
//			success(function(data, status, headers, config) {
//		}).
//	  	error(function(data, status, headers, config) {
//	  		// called asynchronously if an error occurs
//	  		// or server returns response with an error status.
//	  		console.log('ERROR saving content');
//	  	});
       
       }
    
})();
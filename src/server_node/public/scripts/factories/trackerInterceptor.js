angular
    .module('tracker.tools', [])
    .factory('trackerInterceptor', trackerInterceptor);

function trackerInterceptor($q, $rootScope) {
	
	return {
		'request': function(config) {
			// do something on success
	
			return config;
  	    },

  	   'requestError': function(rejection) {
  		   // do something on error
//  		   if (canRecover(rejection)) {
//  			   return responseOrNewPromise
//  		   }
  		   
  		   return $q.reject(rejection);
  	    },

  	    'response': function(response) {
  	    	// Handle unauthorized
  	    	if(response.status === 401) {
  	    		
  	    		// The user is, for whatever reason, not authorized
  	    		$rootScope.$broadcast('Unauthorized');
  	    	}
  	    	
  	    	return response;
  	    },

  	   'responseError': function(rejection) {
 	    	// Handle unauthorized
 	    	if(rejection.status === 401) {
 	    		
 	    		// The user is, for whatever reason, not authorized
 	    		$rootScope.$broadcast('Unauthorized');
 	    	}
  		   
 	    	return $q.reject(rejection);
  	    }
	}
};
angular
    .module('tracker.tools', [])
    .factory('trackerInterceptor', trackerInterceptor);

function trackerInterceptor($q, $rootScope) {
	
	return {
		'request': function(config) {
			$rootScope.$broadcast('loading-start');
			return config;
  	    },

  	   'requestError': function(rejection) {
  		   $rootScope.$broadcast('loading-stop');
  		   
  		   return $q.reject(rejection);
  	    },

  	    'response': function(response) {
  	    	// Handle unauthorized
  	    	if(response.status === 401 || response.status === 403) {
  	    		// The user is, for whatever reason, not authorized
  	    		$rootScope.$broadcast('Unauthorized');
  	    	}
  	    	
  	    	$rootScope.$broadcast('loading-stop');
  	    	
  	    	return response;
  	    },

  	   'responseError': function(rejection) {
 	    	// Handle unauthorized
 	    	if(rejection.status === 401) {
 	    		
 	    		// The user is, for whatever reason, not authorized
 	    		$rootScope.$broadcast('Unauthorized');
 	    	}
 	    	
 	    	$rootScope.$broadcast('loading-stop');
  		   
 	    	return $q.reject(rejection);
  	    }
	}
};
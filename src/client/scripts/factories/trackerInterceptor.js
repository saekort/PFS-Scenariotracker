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
  		   if (canRecover(rejection)) {
  			   return responseOrNewPromise
  		   }
  		   
  		   return $q.reject(rejection);
  	    },

  	    'response': function(response) {
  	    	// do something on success
  	    	
  	    	if(typeof(response.headers('Authorized')) != 'undefined')
  	    	{
  	    		if(response.headers('Authorized') == 'Invalid api-key')
  	    		{
  	    			$rootScope.$broadcast('Unauthorized');
  	    			console.log('Not authorized broadcasted');
  	    		}
  	    	}
  	    	
  	    	return response;
  	    },

  	   'responseError': function(rejection) {
  		   // do something on error
  		   if (canRecover(rejection)) {
  			   return responseOrNewPromise
  		   }
  		   
  		   return $q.reject(rejection);
  	    }
	}
};
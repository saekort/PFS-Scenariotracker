angular
    .module('tracker.filters', [])
    .filter('unsafe', function($sce) {
	    return function(val) {
	        return $sce.trustAsHtml(val);
	    };
	});
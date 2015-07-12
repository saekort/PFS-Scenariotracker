(function(){
    'use strict';

    angular
        .module('scenariotracker')
        .controller('ReportController', ReportController );
    
    function ReportController($http, usSpinnerService)
    {
    	this.playerselect = '';
    }
})();
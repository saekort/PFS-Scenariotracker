
(function(){
    'use strict';

    var scenariotracker = angular.module('scenariotracker', ['ui.bootstrap','ui-rangeSlider', 'angularSpinner']);
    
    // Standard config of modules
    scenariotracker.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setDefaults({color: '#521717'});
    }]);

})();
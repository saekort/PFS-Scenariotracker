/*.directive('icheck', function($timeout, $parse) {
    return {
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value = $attrs['value'];
                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).icheck('updated');
                })

                $scope.$watch($attrs['ngDisabled'], function(newValue) {
                    $(element).icheck(newValue ? 'disable':'enable');
                    $(element).icheck('updated');
                })

                return $(element).icheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal'
                });
            },300);
        }
    };
})*/

(function () {
    /**
     * Create a new module for icheck so that it can be injected into an existing
     * angular program easily.
     */
    angular.module('ui.check', [])
        .directive('icheck', function ($timeout, $parse) {
            return {
                require: 'ngModel',
                link: function($scope, element, $attrs, ngModel) {
                    return $timeout(function() {
                        var value;
                        value = $attrs['value'];

                        $scope.$watch($attrs['ngModel'], function(newValue){
                            $(element).icheck('update');
                        })

                        return $(element).icheck({
                            checkboxClass: 'icheckbox_square-orange',
                            radioClass: 'iradio_square-orange'

                        }).on('ifChanged', function(event) {
                            if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                                $scope.$apply(function() {
                                    return ngModel.$setViewValue(event.target.checked);
                                });
                            }
                            if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                                return $scope.$apply(function() {
                                    return ngModel.$setViewValue(value);
                                });
                            }
                        });
                    });
                }
            };
        });
})();
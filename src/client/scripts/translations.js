angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('fr', {"About":"À propos","Are you sure?":"êtes-vous sûr?","Report":"Rapporter"});
/* jshint +W100 */
}]);
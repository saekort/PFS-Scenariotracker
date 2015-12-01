module.exports = function (grunt) {
    grunt.initConfig({
        //compute the .html files of the view folders and
        // generates a lang/template.pot file that can be used as starting point for translations
        nggettext_extract: {
            pot: {
                files: {
                    'src/client/lang/template.pot': ['src/client/views/**/*.html']
                }
            },
        },
        //processe all the lang/po/*.po files to make them angular-readable inside the script/translation.js file
        nggettext_compile: {
            all: {
                files: {
                    'src/client/scripts/translations.js': ['src/client/lang/po/*.po']
                }
            },
        }
    });
    grunt.loadNpmTasks('grunt-angular-gettext');
    grunt.registerTask('default', ['nggettext_extract', 'nggettext_compile']);
}



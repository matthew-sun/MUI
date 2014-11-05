module.exports = function( grunt ) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        nodeunit: {
            all: [ 'test/**/*.js', '!test/samples/**/*.js' ]
        }

    });

    grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );

    grunt.registerTask( 'test', [ 'nodeunit' ] );
};
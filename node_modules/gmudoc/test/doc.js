(function() {
    'use strict';

    var fs = require( 'fs' ),
        Doc = require( '../doc.js' );
            

    exports.testDoc = function( test ) {
        var doc = new Doc({
                files: ['test/samples/sample1.js']
            });

        doc.run();

        test.done();
    }
})();
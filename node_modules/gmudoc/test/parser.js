(function() {
    'use strict';

    var fs = require( 'fs' ),
        Parser = require( '../lib/parser.js' ),
        parser = new Parser(),
        comments = parser.parseComments( 'test/samples/sample1.js' );
            

    exports.testParseComment1 = function( test ) {
        var ret = comments[ 0 ];

        test.equal( ret.length, 2 );
        test.equal( ret[ 0 ].key, 'desc' );
        test.equal( ret[ 0 ].val, 'Test abcdefa' );
        test.equal( ret[ 1 ].key, 'file' );
        test.equal( ret[ 1 ].val, 'what' );

        test.done();
    };

    exports.testParseComment2 = function( test ) {
        var ret = comments[ 1 ];

        test.equal( ret.length, 3 );
        test.equal( ret[ 0 ].key, 'desc' );
        test.equal( ret[ 0 ].val, 'Test abcdefa' );
        test.equal( ret[ 1 ].key, 'name' );
        test.equal( ret[ 1 ].val, 'what' );
        test.equal( ret[ 2 ].key, 'name2' );
        test.equal( ret[ 2 ].val, '' );

        test.done();
    };

    exports.testParseComment3 = function( test ) {
        var ret = comments[ 2 ];

        test.equal( ret.length, 4 );
        test.equal( ret[2].key, 'constructor' );
        test.equal( ret[3].key, 'constructor' );

        test.done();
    };

    exports.testParseComment4 = function( test ) {
        var ret = comments[ 3 ];

        test.equal( ret.length, 3 );
        
        test.equal( ret[ 0 ].key, 'param' );
        test.equal( ret[ 0 ].val, 'Argument 1' );
        test.equal( ret[ 0 ].name, 'foo' );
        test.equal( ret[ 0 ].types.length, 1 );
        test.equal( ret[ 0 ].types[ 0 ], 'String' );

        test.equal( ret[ 1 ].key, 'param' );
        test.equal( ret[ 1 ].val, 'Argument 2' );
        test.equal( ret[ 1 ].name, 'foo2' );
        test.equal( ret[ 1 ].types.length, 2 );
        test.equal( ret[ 1 ].types[ 0 ], 'String' );
        test.equal( ret[ 1 ].types[ 1 ], 'Object' );

        test.equal( ret[ 2 ].key, 'return' );
        test.equal( ret[ 2 ].val, 'Returns true on success' );
        test.equal( ret[ 2 ].types.length, 1 );
        test.equal( ret[ 2 ].types[ 0 ], 'Boolean' );

        test.done();
    };
})();
( function () {

    'use strict';

    var _DATA = {},
        fs = require( "fs" ),
        $ = require( "./lib/util"),
        extractor = require( "./lib/extractor" ),
        view = require( "../views/ueditor" ),
        parser = require( "./lib/parser" ),
        docSyntax = require( "./lib/syntax" ),
        BASE_PATH = fs.realpathSync( "." );

    function ApiDoc ( options ) {

        this._id = generateIdentifier();
        _DATA[ this._id ].options = options;

    }

    /**
     * ID生成
     * @returns {*}
     */
    function generateIdentifier () {

        var ident = Math.floor( Math.random() * 10000 );

        if ( ident in _DATA ) {
            return generateIdentifier();
        }

        _DATA[ ident ] = {};

        return ident;

    }

    $.extend( ApiDoc.prototype, {

        run: function () {

            var origin = extractor.extract( [ '../src/Editor.js', '../src/config.js' ], BASE_PATH ),
                jsonData = {};
            $.forOwn( origin, function ( comments, filepath ) {

                jsonData[ filepath ] = parser.parse( comments );

            } );

            jsonData = docSyntax.parse( jsonData );

            view.build( jsonData, function ( data ) {

                fs.writeFileSync( './api.html', data );

            } );

        }

    } );

    new ApiDoc().run();

} )();
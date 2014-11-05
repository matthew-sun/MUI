( function () {

    'use strict';

    var fs = require( "fs"),
        $ = require( "./util"),
        corePath = require( "path"),
        readerOptions = {
            encoding: 'utf-8',
            flag: 'r'
        };


    var Extractor = {

        captureContent: function ( srcs, path ) {

            var files = {};

            srcs.forEach( function ( src ) {

                src = Extractor.getRealpath( src, path );

                files[ src ] = fs.readFileSync( src, readerOptions );

            } );

            return files;

        },

        getRealpath: function ( originPath, path ) {

            originPath = originPath.trim();

            if ( originPath.indexOf( "/" ) !== '0' ) {

                originPath = path + "/" + originPath;

            }

            return corePath.normalize( originPath );

        },

        extractComment: function ( content ) {

            var pattern = /\/\*{2,}\s*([\s\S]*?)(\s*\*+\/)/g,
                match = null,
                result = [];

            while ( match = pattern.exec( content ) ) {

                result.push( match[1] );

            }

            return result;

        }

    };

    module.exports = {

        extract: function ( srcs, basePath ) {

            var files = Extractor.captureContent( srcs, basePath || rs.realpathSync( "." ) ),
                comments = {};

            $.forOwn( files, function ( content, filepath ) {

                comments[ filepath ] = Extractor.extractComment( content );

            } );

            return comments;

        }

    };


} )();
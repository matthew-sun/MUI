( function () {

    'use strict';

    var Parser = {

        parse: function ( comment ) {

            var parsePattern = /@([\s\S]+?)(?=\n\s*@|$)/g,
                match = null,
                result = {};

            comment = this.trim( comment );

            //解析描述
            result.desc = [ this.parseDesc( comment ) ];

            while ( match = parsePattern.exec( comment ) ) {

                match = this.getKeyValue( match[0] );

                if ( match ) {

                    if ( result.hasOwnProperty( match.key ) ) {
                        result[ match.key ].push( match.value );
                    } else {
                        result[ match.key ] = [ match.value ];
                    }

                }

            }

            return result;

        },

        trim: function ( comment ) {

            var line = [],
                trimPattern = /^\s*\*/;

            comment.split( '\n' ).forEach( function ( commentLine ) {

                line.push( commentLine.replace( trimPattern, '' ) );

            } );

            return line.join( "\n" );

        },

        getKeyValue: function ( comment ) {

            var keyValue = null;

            if ( /@([^\s]+)([\s\S]*)$/.test( comment ) ) {

                keyValue = {
                    key: RegExp['$1'],
                    value: RegExp['$2'].trim()
                };

            }

            return keyValue;

        },

        parseDesc: function ( comment ) {

            if ( /^\s*(?!@)([\s\S]*?)(?=\n\s*@|$)/.test( comment ) ) {

                return RegExp.$1;

            }

            return '';

        }

    };

    module.exports = {

        parse: function ( comments ) {

            var result = [];

            comments.forEach( function ( comment ) {

                result.push( Parser.parse( comment ) );

            } );

            return result;

        }

    };

} )();
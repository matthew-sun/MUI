( function () {

    'use strict';

    var $ = require( "./util" ),
        TYPE = {
            'METHOD': 'method',
            'CONSTRUCTOR': 'constructor',
            'EVENT': 'event',
            'PROPERTY': 'property',
            'CLASS': 'class',
            'MODULE': 'module',
            'MEMBER': 'member',
            'FILE': 'file'
        },
        definition = [ {

            type: TYPE.FILE,
            check: function ( data ) {

                return data.hasOwnProperty( TYPE.FILE );

            }

        }, {

            type: TYPE.CONSTRUCTOR,

            check: function ( data ) {

                return data.hasOwnProperty( TYPE.CONSTRUCTOR );

            },

            format: function ( data ) {

                data[ TYPE.METHOD ] = [ data[ 'class' ] ];
                data[ TYPE.CONSTRUCTOR ] = data[ TYPE.CONSTRUCTOR ][ 0 ];
                formatUtil[ TYPE.METHOD ]( data );

            }

        }, {

            type: TYPE.METHOD,

            check: function ( data ) {

                return data.hasOwnProperty( TYPE.METHOD );

            },

            format: function ( data ) {

                var params = [];

                data.name = data[ TYPE.METHOD ][ 0 ];
                data.desc = data.desc[ 0 ];

                if ( data.hasOwnProperty( "param" ) ) {

                    data.param.forEach( function ( par ) {

                        if ( /^\s*{([^}]+)}\s+([^\s]+)\s+([\s\S]*)/.test( par ) ) {

                            params.push( {
                                type: RegExp.$1.trim(),
                                name: RegExp.$2.trim(),
                                desc: RegExp.$3.trim()
                            } );

                        }

                    } );

                    data.param = params;

                }

                if ( data.hasOwnProperty( "return" ) ) {

                    if ( /^\s*{([^}]+)}([\s\S]*)/.test( data['return'][0] ) ) {

                        data[ 'return' ] = {
                            type: RegExp.$1.trim(),
                            desc: RegExp.$2.trim()
                        };

                    }

                }

                delete data[ TYPE.METHOD ];

            }

        }, {

            type: TYPE.PROPERTY,

            check: function ( data ) {

                return data.hasOwnProperty( TYPE.PROPERTY );

            },

            format: function ( data ) {

                data.name = data[ TYPE.PROPERTY ][ 0 ];

                if ( /^\s*{([^}]+)}(\s*[^\s]+)(\s*[\s\S]*)$/.test( data.name ) ) {

                    data.name = RegExp.$2.trim();
                    data.type = RegExp.$1.trim();
                    data.desc = RegExp.$3.trim();

                }

                data.hasOwnProperty( 'default' ) && ( data[ 'default' ] = data[ 'default' ][ 0 ] );
                delete data[ TYPE.PROPERTY ];

            }

        }, {

            type: TYPE.EVENT,
            check: function ( data ) {

                return data.hasOwnProperty( TYPE.EVENT );

            },

            format: function ( data ) {

                data.name = data[ TYPE.EVENT ][ 0 ];
                data.desc = data.desc[ 0 ];
                delete data[ TYPE.EVENT ];

            }

        }, {

            type: TYPE['CLASS'],
            check: function ( data ) {

                return data.hasOwnProperty( TYPE['CLASS'] );

            },

            format: function ( data ) {

                data.name = data[ TYPE[ 'CLASS' ] ];
                data.desc = data.desc[ 0 ];

                delete data[ TYPE[ 'CLASS' ] ];

            }

        }, {

            type: TYPE.MODULE,

            check: function ( data ) {

                return data.hasOwnProperty( TYPE.MODULE );

            },

            format: function ( data ) {

                data.name = data[ TYPE.MODULE ];
                data.desc = data[ 'desc' ][ 0 ];

                delete data[ TYPE.MODULE ];
                delete data[ 'define' ];

            }

        } ],
        formatUtil = {};


    //format工具提取
    $.forOwn( definition, function ( defini ) {

        formatUtil[ defini.type ] = defini.format;

    } );


    /**
     * 通用格式化
     */
    function universalFormat ( data ) {

        $.isArray( data.module ) && ( data.module = data.module[ 0 ] );
        $.isArray( data[ 'class' ] ) && ( data[ 'class' ] = data[ 'class' ][ 0 ] );

        //static补充
        if ( !data.hasOwnProperty( "class" ) && !data.hasOwnProperty( "static" ) && ( data.__type === TYPE.METHOD || data.__type === TYPE.PROPERTY ) ) {
            data[ 'static' ] = [ "" ];
        }

        if ( data.hasOwnProperty( "unfile" ) ) {
            delete data.unfile;
        }

    }


    module.exports = {

        getType: function ( data ) {

            var type = null;

            definition.forEach( function ( defini ) {

                if ( !type && defini.check( data ) ) {
                    type = defini.type;
                }

            } );

            return type;

        },

        TYPE: TYPE,

        format: function ( data, type ) {

            data.__type = type;
            //通用处理
            universalFormat( data );
            formatUtil[ type ] && formatUtil[ type ]( data );

        }

    };

} )();
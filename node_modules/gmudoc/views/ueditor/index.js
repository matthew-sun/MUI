( function () {

    "use strict";

    var $ = require( '../../new/lib/util' ),
        ejs = require( 'ejs' ),
        fs = require( 'fs' ),
        pygments = require('pygments').colorize,
        marked = require( 'marked' ),
        ViewHelper = require( "./viewhelper" ),
        NavRender = require( "./navrender" ),
        fileOptions = {
            encoding: 'utf-8'
        },
        MEMBER_TYPE = {
            CONSTRUCTOR: 'constructor',
            METHOD: 'method',
            PROPERTY: 'property',
            EVENT: 'event'
        };

    var View = {

        /**
         * 执行数据转换， 以便于render
         * @param data 数据
         */
        transform: function ( data, callback ) {


            var transResult = [],
                count = 0,
                exampleKey = "example";
            debugger;

            $.forOwn( data, function ( moduleData ) {

                transResult = transResult.concat( View.extractData( exampleKey, moduleData ) );

            } );

            //example 解析
            transResult.forEach( function ( targetData ) {

                targetData.example.forEach( function ( exp, index ) {

                    count++;

                    if ( /`{3}([^\n]*)\n([\s\S]*?)(\s*`{3}$|$)/.test( exp ) ) {

                        //代码高亮
                        pygments( RegExp.$2, RegExp.$1 || 'javascript', 'html', function( data ) {

                            count--;

                            targetData.example[ index ] = data;

                            if ( !count ) {
                                callback();
                            }

                        }, {
                            O: 'style=colorful,linenos=table,encoding=utf-8 '
                        });

                    } else {

                        count--;

                        //置空
                        targetData.example[ index ] = '';

                        if ( !count ) {
                            callback();
                        }

                    }

                } );

            } );

        },

        extractData: function ( keyword, data ) {

            var result = [];

            View.getAllMembers( data ).forEach( function ( targetData ) {

                targetData.hasOwnProperty( keyword ) && result.push( targetData );

            } );

            return result;

        },

        getAllMembers: function ( data ) {

            var result = [];

            if ( data.__type === "module" ) {

                data[ 'class' ] && $.forOwn( data[ 'class' ], function ( classData ) {

                    classData.__member && ( result = result.concat( classData.__member ) );

                } );

            }

            debugger;

            data.__member && ( result = result.concat( data.__member ) );

            return result;

        },

        render: function ( data ) {

            var tplData = [],
                navTpl = View.renderNavigation( data );

            $.forOwn( data, function ( moduleData ) {

                tplData.push( View.renderModule( moduleData ) );

            } );

            return View.renderPage( tplData, navTpl );

        },

        _renderTpl: function ( filepath, data ) {

            filepath = '/home/hn/workspace/phpstrom/gmudoc/views/ueditor/tpl/' + filepath;

            return ejs.render( fs.readFileSync( filepath, fileOptions ), $.extend( {}, data, {
                _self: data,
                ViewHelper: ViewHelper
            } ) );

        },

        renderPage: function ( tplData, navHtml ) {

            return this._renderTpl( 'layout.ejs', {
                modules: tplData,
                nav: navHtml
            } );

        },

        renderNavigation: function ( data ) {

            return NavRender.renderNav( data );

        },

        renderModule: function ( moduleData ) {

            moduleData.__memberTpl = {};

            moduleData.__classTpl = [];

            if ( moduleData.__member ) {

                moduleData.__memberTpl = View.renderMember( moduleData.__member );

            }

            if ( moduleData.hasOwnProperty( "class" ) ) {

                moduleData.__classTpl = View.renderClass( moduleData[ 'class' ] );

            }

            return View._renderTpl( 'module.ejs', moduleData );

        },

        renderClass: function ( classData ) {

            var result = [];

            $.forOwn( classData, function ( clazzData ) {

                clazzData.__memberTpl = {};

                if ( clazzData.__member ) {
                    clazzData.__memberTpl = View.renderMember( clazzData.__member );
                }

                result.push( View._renderTpl( 'class.ejs', clazzData ) );

            } );

            return result;

        },

        renderMember: function ( memberData ) {

            var result = {};

            $.forOwn( MEMBER_TYPE, function ( type ) {

                result[ type ] = [];

            } );

            memberData.forEach( function ( data ) {

                switch ( data.__type ) {

                    case MEMBER_TYPE.CONSTRUCTOR:
                        result[ MEMBER_TYPE.CONSTRUCTOR ].push( View.renderConstructor( data ) );
                        break;

                    case MEMBER_TYPE.METHOD:
                        result[ MEMBER_TYPE.METHOD ].push( View.renderMethod( data ) );
                        break;

                    case MEMBER_TYPE.PROPERTY:
                        result[ MEMBER_TYPE.PROPERTY ].push( View.renderProperty( data ) );
                        break;

                    case MEMBER_TYPE.EVENT:
                        result[ MEMBER_TYPE.EVENT ].push( View.renderEvent( data ) );
                        break;

                    default:
                        throw new Error( 'unknow member type!' );

                }

            } );

            return result;

        },

        renderClassMember: function ( classData ) {

            var result = [];

            $.forOwn( classData, function ( clazzData ) {

                return View._renderTpl( 'event.ejs', data );

            } );

            return result;

        },

        renderMethod: function ( data ) {

            return View._renderTpl( 'method.ejs', data );

        },

        renderConstructor: function ( data ) {

            return View._renderTpl( 'constructor.ejs', data );

        },

        renderProperty: function ( data ) {

            return View._renderTpl( 'property.ejs', data );

        },

        renderEvent: function ( data ) {

            return View._renderTpl( 'event.ejs', data );

        }

    };

    module.exports = {

        build: function ( data, callback ) {

            View.transform( data, function () {

                callback( View.render( data ) );

            } );

        }

    };

} )();
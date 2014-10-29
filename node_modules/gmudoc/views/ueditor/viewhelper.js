/**
 * 视图工具类
 */

( function () {

    "use strict";

    var defini = require( "../../new/lib/definition"),
        fs = require( "fs" ),
        ejs = require( 'ejs' ),
        fileOptions = {
            encoding: 'utf-8'
        },
        ITEM_TYPE = defini.TYPE,
        ViewHelper = null,
        Helper = {

            renderTpl: function ( filepath, data ) {

                data._self = data;
                data.ViewHelper = ViewHelper;

                filepath = '/home/hn/workspace/phpstrom/gmudoc/views/ueditor/tpl/' + filepath;

                return ejs.render( fs.readFileSync( filepath, fileOptions ), data );

            }

        };

    module.exports = ViewHelper = {

        getTitle: function ( data, isLink, isWithPrefix ) {

            switch ( data.__type ) {

                case ITEM_TYPE.CONSTRUCTOR:
                case ITEM_TYPE.METHOD:
                    return this.getMethodTitleHtml.apply( this, arguments );

                case ITEM_TYPE.PROPERTY:
                    return this.getPropertyTitleHtml.apply( this, arguments );

                case ITEM_TYPE.EVENT:
                    return this.getEventTitleHtml.apply( this, arguments );

                case ITEM_TYPE.CLASS:
                    return this.getClassTitleHtml.apply( this, arguments );

                case ITEM_TYPE.MODULE:
                    return this.getModuleTitleHtml.apply( this, arguments );

            }

        },

        //解析method签名HTML
        getMethodTitleHtml: function ( data, isLink, isWithPrefix ) {

            return ViewHelper.renderSignature( {

                anchor: ViewHelper.getPath( data ),
                signature: ViewHelper.getMethodSignatureHtml( data, !isLink, !!isWithPrefix )

            }, !!isLink );

        },

        //解析事件签名
        getEventTitleHtml: function ( data, isLink, isWithPrefix ) {

            return ViewHelper.renderSignature( {

                anchor: ViewHelper.getPath( data ),
                signature: ViewHelper.getEventSignatureHtml( data, !!isWithPrefix )

            }, !!isLink );

        },

        //属性签名
        getPropertyTitleHtml: function ( data, isLink, isWithPrefix ) {

            return ViewHelper.renderSignature( {

                anchor: ViewHelper.getPath( data ),
                signature: ViewHelper.getEventSignatureHtml( data, !!isWithPrefix )

            }, !!isLink );

        },

        //生成类签名
        getClassTitleHtml: function ( data, isLink, isWithPrefix ) {

            return ViewHelper.renderSignature( {

                anchor: ViewHelper.getPath( data ),
                signature: ViewHelper.getClassSignatureHtml( data, !!isWithPrefix )

            }, !!isLink );

        },

        getModuleTitleHtml: function ( data, isLink ) {

            var anchor = data.name;

            return ViewHelper.renderSignature( {

                anchor: anchor,
                signature: anchor

            }, !!isLink );

        },

        renderSignature: function ( data, isLink ) {

            return !!isLink ? Helper.renderTpl( 'widget/signature.link.ejs', data ) : Helper.renderTpl( 'widget/signature.anchor.ejs', data );

        },

        getPropertyWidget: function ( data ) {

            var props = this.getMembers( 'property', data );

            if ( !props.length ) {
                return '';
            }

            return Helper.renderTpl( 'widget/property.ejs', {
                props: props
            } );

        },

        getEventWidget: function ( data ) {

            var events = this.getMembers( 'event', data );

            if ( !events.length ) {
                return '';
            }

            return Helper.renderTpl( 'widget/event.ejs', {
                events: events
            } );

        },

        getMethodWidget: function ( data ) {

            var methods = this.getMembers( 'method', data);

            if ( !methods.length ) {
                return '';
            }

            return Helper.renderTpl( 'widget/method.ejs', {
                methods: methods
            } );

        },

        getConstructorWidget: function ( data ) {

            var constructors = this.getMembers( 'constructor', data );

            if ( !constructors.length ) {
                return '';
            }

            return Helper.renderTpl( 'widget/constructor.ejs', {
                constructors: constructors
            } );

        },

        getClassWidget: function ( data ) {

            var classes = data[ 'class' ];

            if ( !classes ) {
                return '';
            }

            return Helper.renderTpl( 'widget/class.ejs', {
                classes: classes
            } );

        },

        getMembers: function ( type, data ) {

            var result = [];

            if ( !data.hasOwnProperty( '__member' ) ) {
                return result;
            }

            data.__member.forEach( function ( memberData ) {

                if ( memberData.__type === type ) {
                    result.push( memberData );
                }

            } );

            return result;

        },

        getNameWithPrefix: function ( data ) {

            var signature = data.module;

            if ( data.hasOwnProperty( "class" ) ) {

                signature += '.' + data[ 'class' ];

            }

            signature += ( !!data.hasOwnProperty( "static" ) ? '.' : ':' ) + data.name;

            return signature;

        },

        getMethodSignatureHtml: function ( data, isLink, isWithPrefix ) {

            var signature = isWithPrefix ? ViewHelper.getNameWithPrefix( data ) : data.name,
                paramStr = '()';


            if ( data.hasOwnProperty( 'param' ) ) {

                paramStr = [];

                data.param.forEach( function ( para ) {

                    if ( isLink ) {
                        paramStr.push( '<a href="#'+ para.type +'">'+ para.type +'</a>' + ' ' + para.name );
                    } else {
                        paramStr.push( para.type + ' ' + para.name );
                    }

                } );

                paramStr = paramStr.join( ', ' );

                paramStr = '(' + paramStr + ')';

            }

            return signature + paramStr;

        },

        getEventSignatureHtml: function ( data, isWithPrefix ) {

            return isWithPrefix ? ViewHelper.getNameWithPrefix( data ) : data.name;

        },

        getClassSignatureHtml: function ( data, isWithPrefix ) {

            return isWithPrefix ? ViewHelper.getNameWithPrefix( data ) : data.name;

        },

        //获取当前处理对象的路径
        getPath: function ( data ) {

            switch ( data.__type ) {

                case ITEM_TYPE.MODULE:

                    return data.name;

                case ITEM_TYPE.CLASS:

                    return data.module + "." + data.name;

                case ITEM_TYPE.METHOD:
                case ITEM_TYPE.CONSTRUCTOR:

                    return this.getMethodPath( data );

                case ITEM_TYPE.PROPERTY:

                    return this.getPropertyPath( data );

                default:

                    return data.module + "." + data.class + ":" + data.name;

            }

        },

        getMethodPath: function ( data ) {

            var start = data.module + "." + data.class + ":" + data.name,
                paramStr = [];

            data.param && data.param.forEach( function ( par ) {
                paramStr.push( par.type );
            } );

            paramStr = "(" + paramStr.join( "," ) + ")";

            return start + paramStr;

        },

        getPropertyPath: function ( data ) {

            var start = data.module;

            if ( data.hasOwnProperty( "class" ) ) {
                start += "." + data[ 'class' ];
            }

            //静态属性和实力属性的path是有区别的
            if ( data.hasOwnProperty( "static" ) ) {

                start += "." + data.name;

            } else {

                start += ":" + data.name;

            }

            return start;

        }

    };

} )();
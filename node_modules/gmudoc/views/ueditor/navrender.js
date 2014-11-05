( function () {

    var fs = require( "fs" ),
        ejs = require( 'ejs' ),
        $ = require( 'lodash' ),
        ViewHelper = require( './viewhelper' ),
        fileOptions = {
            encoding: 'utf-8'
        },
        TYPE = require( '../../new/lib/definition' ).TYPE;


    var NavHelper = {

        getApiListByModule: function ( moduleData ) {

            var apiList = [],
                apiPackage = null;

            //模块直属API提取
            if ( moduleData.hasOwnProperty( '__member' ) ) {

                apiList.push( {
                    packageName: moduleData.name,
                    member: moduleData.__member
                } );

            }

            //类成员API提取
            if ( moduleData.hasOwnProperty( 'class' ) ) {

                apiList = apiList.concat( NavHelper.getApiListByClass( moduleData[ 'class' ] ) );

            }

            return apiList;

        },

        getApiListByClass: function ( classData ) {

            var apiList = [];

            $.forOwn( classData, function ( clazzData ) {

                if ( clazzData.hasOwnProperty( "__member" ) ) {

                    apiList.push( {
                        packageName: ViewHelper.getPath( clazzData ),
                        member: clazzData.__member
                    } );

                }

            } );

            return apiList;

        },

        renderTpl: function ( filepath, data ) {

            data._self = data;
            data.ViewHelper = ViewHelper;

            filepath = '/home/hn/workspace/phpstrom/gmudoc/views/ueditor/tpl/' + filepath;

            return ejs.render( fs.readFileSync( filepath, fileOptions ), data );

        }

    };

    module.exports = {

        renderNav: function ( dataTree ) {

            //数组格式的api列表。 用于检索用
            var apiList = [],
                moduleData = [];

            $.forOwn( dataTree, function ( moduleTree ) {

                apiList = apiList.concat( NavHelper.getApiListByModule( moduleTree ) );
                moduleData.push( moduleTree );

            } );

            return NavHelper.renderTpl( 'nav.html', {
                moduleData: moduleData,
                apiList: apiList
            } );

        }

    };

} )();
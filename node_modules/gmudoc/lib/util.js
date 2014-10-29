(function() {
    'use strict';

    var fs = require( 'fs' ),
        path = require( 'path' ),
        _ = require( 'lodash' )._;

    function inherits ( child, parent ) {

        // 复制静态属性和方法
        _.each( parent, function( val, key ){
            child[ key ] = val;
        } );

        child.prototype = Object.create( parent.prototype, {
            constructor: {
                value: child,
                enumerable: false,
                writable: true,
                configurable: true
            }
        } );

        child.__super__ = parent;
    }

    function readFile( src, options ) {
        options = options || 'utf-8';
        return fs.readFileSync( src, options );
    }

    function writeFile( desc, content, options ) {
        var folder = path.dirname( desc );
        mkdir( folder );
        options = options || 'utf-8';
        return fs.writeFileSync( desc, content, options );
    }

    function fileExist() {
        var filepath = path.join.apply( path, arguments );
        return fs.existsSync( filepath );
    }

    function mkdir( folder, mode ) {
        /*jshint eqnull:true */
        if (mode == null) {
            mode = parseInt( '0777', 8 ) & (~process.umask());
        }

        folder.split(/[\/\\]/g).reduce( function( parts, part ) {
            parts = path.join( parts, part );

            if ( !fileExist( parts ) ) {

                try {
                    fs.mkdirSync( parts, mode );
                } catch (e) {
                    throw new Error( '创建目录"' + parts + '"失败(错误代码：' + e.code + ')' );
                }
            }
            return parts;
        }, '' );
    }

    function rmdir( folder ) {
        var stat;

        if( !fileExist( folder ) ) {
            return;
        }

        stat = fs.statSync( folder );

        if( stat.isDirectory() ) {
            fs.readdirSync( folder ).map(function( child ) {
                return path.join( folder, child );
            }).forEach( rmdir );

            fs.rmdirSync( folder );
        } else if ( stat.isFile() ) {
            fs.unlinkSync( folder );
        }
    }

    function copyFile( src, desc ) {
        var options = {
                encoding: null
            };

        writeFile( desc, readFile( src, options ), options );
    }

    // 暴露
    exports.inherits = inherits;
    exports.extend = _.assign;
    exports.eachObject = _.forEach;
    exports.readFile = readFile;
    exports.writeFile = writeFile;
    exports.copyFile = copyFile;
    exports.fileExist = fileExist;
    exports.mkdir = mkdir;
    exports.rmdir = rmdir;
    exports._ = _;

})();
(function() {
    'use strict';

    var util = require( './util.js' ),
        glob = require( 'glob' ),
        path = require( 'path' );

    // interface
    function CollectorPlugin() {
        throw new Error( 'Not implemented!' );
    }

    CollectorPlugin.prototype.collect = function() {
        throw new Error( 'Not implemented!' );
    }


    /**
     * 文件收集器。
     * @class GlobCollector
     * @constructor
     */
    function GlobCollector() {
    }

    util.inherits( GlobCollector, CollectorPlugin );

    /**
     * 通过glob来收集文件。详情请参考[glob](https://github.com/isaacs/node-glob)!
     * @method  collect
     * @param  {String | Array} patterns 模式，参考glob的模式说明。
     * @param  {String} cwd   当前目录
     * @return {Array}       返回结果集
     */
    GlobCollector.prototype.collect = function( files, cwd ) {
        var opts = {
                sync: true
            },
            ret = [];

        if ( !Array.isArray( files ) ) {
            files = [ files ];
        }

        cwd = path.resolve( cwd || process.cwd() );
        opts.cwd = cwd;

        files.forEach(function( pattern ){
            var exclude = pattern.substring( 0, 1 ) === '!',
                mathes;

            if ( exclude ) {
                pattern = pattern.substring( 1 );
            }

            mathes = glob.sync( pattern, opts );
            ret = util._[ exclude ? 'difference' : 'union' ]( ret, mathes );
        });

        return ret.map(function( filepath ){
            return {
                relative: filepath,
                cwd: cwd,
                absolute: path.join( cwd, filepath )
            }
        });
    };

    exports.CollectorPlugin = CollectorPlugin;
    exports.GlobCollector = GlobCollector;
})();
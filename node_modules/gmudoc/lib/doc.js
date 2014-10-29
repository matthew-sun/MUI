/**
 * @file 文档生成工具类
 */
(function() {
    'use strict';

    var util = require( './util.js' ),
        EventEmitter = require( 'events' ).EventEmitter,
        collector = require( './collector.js' ),
        extractor = require( './extractor.js' ),
        parser = require( './parser.js' ),
        builder = require( './builder.js' ),
        path = require( 'path' );

    function Doc( options ) {
        this.options = util.extend( {}, Doc.options, options );
        this.reset();

    }
    util.inherits( Doc, EventEmitter );

    Doc.options = {
        cwd: null,
        files: [],
        themeDir: path.join( __dirname, '../', 'views'),
        theme: 'ueditor',
        outputDir: './output',
        markdown: true
    };

    util.extend( Doc.prototype, {

        reset: function() {
            this.files = [];
        },


        setCollector: function( instance ) {
            if ( !(instance instanceof collector.CollectorPlugin ) ) {
                throw new Error( 'Collector必须是CollectorPlugin的实例' );
            }
            this.collecotor = instance;
        },

        // 收集文件信息。
        _collect: function() {
            var opts = this.options,
                instance = this.collector || new collector.GlobCollector( this );

            return instance.collect( opts.files, opts.cwd );
        },

        _extract: function( files ) {
            var instance = this.extractor || new extractor.Extractor( this );
            return instance.extract( files );
        },

        _parse: function( raw ) {
            var instance = this.parser || new parser.Parser( this );

            return instance.parse( raw );
        },

        _build: function( json, callback ) {
            var instance = this.builder || new builder.Builder( this );
            instance.build( json, callback );
        },

        run: function( callback ) {
            var files = this._collect(),
                raw,
                json;

            raw = this._extract( files );
            json = this._parse( raw );
            this._build( json, callback );

        }
    } );

    module.exports = Doc;
})();
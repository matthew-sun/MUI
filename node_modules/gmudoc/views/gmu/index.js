(function(){
    var util = require( '../../lib/util.js' ),
        _ = util._,
        ejs = require( 'ejs' ),
        marked = require( 'marked' ),
        path = require( 'path' ),
        sha1 = require( 'sha1' ),
        qr = require( 'qrpng' ),
        async = require( 'async' ),
        GlobCollector = require( '../../lib/collector.js' ).GlobCollector,
        view;

    function View() {
        var me = this;

        this.locals = {};
        this.localStack = [ this.locals ];
        this.qrcodes = {};


        // 注册变量和方法给tpl用
        this.assign( '_', _ );


        // 最好把一些危险的方法移出。比如build, render方法。
        _.forEach( View.prototype, function( fn, name ) {
            me.assign( name, function() {
                return fn.apply( me, arguments );
            } );
        } );


        // 注册主题
        me.assign( 'themes', {
            purple: './css/purple.css',
            blue: './css/blue.css',
            dark: './css/dark.css',
            orange: './css/orange.css'
        });
        me.assign( 'activeTheme', 'purple' );
    }

    util.extend( View.prototype, {
        init: function( opts ) {
            this.assign( 'title', opts.title || 'GMU API 文档' );
            this.themeDir = opts.tplDir || path.join( __dirname, 'tpl' );
        },

        assign: function( key, val ) {
            this.locals[ key ] = val;
        },

        fetch: function( key ) {
            return this.locals[ key ] || '';
        },

        build: function( json, complete ) {
            var me = this,
                qrcodes;

            this.files = {};
            this.transform( json );
            this.render();

            qrcodes = this.qrcodes;

            async.each( Object.keys( qrcodes ), function( key, next ){
                var value = qrcodes[ key ];

                qr( value, 3, function( err, png ) {
                    if ( err ) {
                        throw new Error( err );
                    }

                    me.files[ key ] = png;
                    next();
                });
            }, function( err ){
                if( !err ) {
                    complete( me.files );
                }
            });

        },

        gennerateID: function( str ) {
            return str.replace(/[^a-zA-Z0-9_]+/g, '_');
        },

        forUrl: function( href ) {
            return '#' + this.gennerateID( href );
        },

        transform: function( json ) {
            var navs = {},
                modules = {},
                me = this;

            _.forEach( json.modules, function( module ) {
                var modulename = module.name,
                    host = navs[ modulename ] = {};

                _.forEach( module.items, function( item ) {
                    host[ modulename ] = host[ modulename ] || [];
                    host[ modulename ].push({
                        text: item.shortname || item.name,
                        skin: item.itemtype,
                        href: me.forUrl( modulename + ':' + item.name )
                    });
                    me.addSearchEntry( item.shortname || item.name, item.name,
                            me.forUrl( modulename + ':' + item.name),
                            item.description, modulename );
                } );

                _.forEach( module.classes, function( clazz ) {
                    var classname = clazz.name,
                        items = [],
                        options = [],
                        events = [];

                    _.forEach( clazz.items, function( item ){
                        host[ classname ] = host[ classname ] || [];

                        switch( item.itemtype ) {
                            case 'event':
                                events.push( item );
                                me.addSearchEntry( item.shortname || item.name, item.name,
                                        me.forUrl( modulename + ':' + classname + ':events' ),
                                        item.description, classname + ' - Events' );
                                break;

                            case 'property':
                                if ( /^options/i.exec( item.name ) ) {
                                    options.push( item );
                                    me.addSearchEntry( item.shortname || item.name, item.name,
                                            me.forUrl( modulename + ':' + classname + ':options' ),
                                            item.description, classname + ' - Options' );

                                    // 如果property不是options大头的，则添加到items里面去。
                                    break;
                                }
                            case 'method':
                            case 'constructor':
                                items.push( item );
                                me.addSearchEntry( item.shortname || item.name, item.name,
                                        me.forUrl( modulename + ':' + classname + ':' + item.name),
                                        item.description, classname );

                                host[ classname ].push({
                                    text: item.shortname || item.name,
                                    skin: item.itemtype,
                                    href: me.forUrl( modulename + ':' + classname + ':' + item.name )
                                });
                                break;
                        }
                    } );

                    events.length && host[ classname ].unshift({
                        skin: 'events',
                        text: 'events',
                        href: me.forUrl( modulename + ':' + classname + ':events' )
                    });

                    options.length && host[ classname ].unshift({
                        skin: 'options',
                        text: 'options',
                        href: me.forUrl( modulename + ':' + classname + ':options' )
                    });

                    clazz.items = items;
                    clazz.options = options;
                    clazz.events = events;
                    clazz.title = clazz.title || '';
                    clazz.description = clazz.description || '';

                    clazz.plugins = clazz.plugins.map(function( name ){
                        var obj = module.classes[ name ];
                        obj.isPlugin = true;
                        return obj;
                    });

                    clazz.plugins.length && host[ classname ].push({
                        skin: 'plugins',
                        text: 'plugins',
                        href: me.forUrl( modulename + ':' + classname + ':plugins' )
                    });
                } );

                module.title = module.title || '';
                module.description = module.description || '';
            } );

            me.assign( 'navs', navs );
            me.assign( 'files', json.files );
            me.assign( 'modules', json.modules );
        },

        renderTpl: function( file, data ) {
            var fileconent,
                locals;

            locals = this.localStack[ this.localStack.length - 1 ];

            data = data ? _.extend( {}, locals, data ) : locals;
            file = path.join( this.themeDir, file + '.ejs' );

            fileconent = util.readFile( file );

            this.localStack.push( data );
            fileconent = ejs.render( fileconent, {
                locals: data
            } );
            this.localStack.pop();

            return fileconent;
        },

        render: function() {
            var content = this.renderTpl( 'layout' ),
                collector = new GlobCollector(),
                files = this.files;

            files[ 'index.html' ] = content;
            collector.collect(['**/*.*', '!*.ejs'], this.themeDir ).forEach(function( file ){
                files[ file.relative ] = file.absolute;
            });
        },

        renderFileInfo: function( filename ) {
            var me = this,
                host = me.localStack[ me.localStack.length - 1 ],
                files = me.fetch('files'),
                file = files[ filename || host.file ],
                html = '';

            html += '<span class="label">文件</span>' + file.name ;

            if( file && file[ 'import' ] ) {
                html += '<span class="label deps">依赖</span>'
                html += me._fixDependencies( file, files ).join(', ');
            }
            return '<div class="fileinfo">!html</div>'.replace(/\!html/, html);
        },

        _fixDependencies: function( file, map ) {
            var me = this,
                ret = file[ 'import' ] || [];

            if ( !file._fixed && file[ 'import' ] ) {

                ret.forEach(function( item ) {
                    map[ item ] && (ret = _.union( me._fixDependencies( map[ item ], map ), ret ));
                });

                file._fixed = true;
            }

            return file[ 'import' ] = ret;
        },

        renderUses: function( arr, wrap ) {
            var parts = [],
                me = this,
                host = me.localStack[ me.localStack.length - 1 ],
                modulename = host.module,
                classes = host.modules[ modulename ].classes,
                clazz;

            arr.forEach(function( val ) {
                if ( val.description ) {
                    parts.push( me.markdown( val.description ).replace(/^<p>(.*?)<\/p>/, '$1') );
                } else {
                    clazz = classes[ val.name ];
                    parts.push( me.markdown( '[' + (clazz ? clazz.shortname || clazz.name : val.name) + '](#' + modulename + ':' + val.name + ')' ).replace(/^<p>(.*?)<\/p>/, '$1') );
                }
            });

            wrap = wrap || '<p><span class="label">依赖: </span>%s</p>';

            return wrap.replace(/%s/, parts.join(', ') );
        },

        renderParams: function( params ) {
            var me = this,
                html = '';

            if ( params && params.length ) {
                html += '<ul class="params-list">';

                _.forEach( params, function( param ) {
                    html += '<li><span class="meta">';

                    param.name && (html += '<code>' + param.name + '</code>');

                    html += ' {' + param.type.join( ', ') + '}';

                    if ( param.optional ) {
                        html += ' [可选]';
                    }

                    if ( param.defaultvalue ) {
                        html += ' [默认值: ' + param.defaultvalue + '] ';
                    }

                    html += '</span>';

                    html += ' ' +  param.description  ? me.markdown( param.description ) : '';

                    if ( param.props ) {
                        html += me.renderParams.call( me, param.props );
                    }

                    html += '</li>';
                } );

                html += '</ul>';
            }

            return html;
        },

        markdown: function( text ) {
            return marked( text );
        },

        formatExample: function( text ) {
            if ( !/```/.test( text ) ) {
                text = '```javascript\n' + text + '\n```';
            }
            return this.markdown( text );
        },

        addSearchEntry: function( label, value, href, desc, category ) {
            var arr;

            arr = this._search_entries || (this._search_entries = []);
            desc = this.stripTags( desc );
            desc = desc.substring(0, 30);

            arr.push({
                label: label,
                value: value,
                desc: desc,
                href: href,
                category: category
            });
        },

        getSearchEntry: function() {
            return this._search_entries || [];
        },

        stripTags: function( input, allowed ) {
            allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
            var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
            return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });
        },

        addQrcode: function( data ) {
            var hash = './qrcode/' + sha1( data ) + '.png';

            this.qrcodes[ hash ] = data;
            return hash;
        }
    } );




    module.exports = view = new View();

    // hack marked.InlineLexer
    (function(){
        var outputLink = marked.InlineLexer.prototype.outputLink;


        marked.InlineLexer.prototype.outputLink = function(cap, link) {
            var match;

            if (cap[0][0] !== '!') {
                match = /^#(.*:.*)/.exec( link.href );
                if ( match ) {
                    link.href = view.forUrl( match[ 1 ] );
                }
            } else {
                match = /^qrcode:(.*)$/i.exec( link.href );
                match && (link.href = view.addQrcode( match[ 1 ] ));
            }
            return outputLink.apply( this, arguments );
        };
    })();
})();
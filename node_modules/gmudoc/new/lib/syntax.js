( function () {

    'use strict';

    var $ = require( "./util" ),
        definition = require( "./definition" ),
        fs = require( "fs" ),
        defaultSpace = {
            module: 'window'
        },
        fileKeyWord = [ "module", "class", "since", "static" ];

    var Syntax = {

        parseSingleFile: function ( fileBlock ) {

            this.applyDefault( fileBlock );

            return this.toTree( fileBlock );

        },

        merge: function ( trees ) {

            var treeRoot = {};

            $.forOwn( trees, function ( tree, filepath ) {

                $.merge( treeRoot, tree );

            } );

            return treeRoot;

        },

        applyDefault: function ( fileBlock ) {

            var file = null;

            fileBlock.forEach( function ( block ) {

                if ( !file && "file" in block ) {
                    file = block;
                }

            } );

            file.module && ( defaultSpace.module = file.module );
            file[ 'class' ] && ( defaultSpace[ 'class' ] = file[ 'class' ] );

            //为每一个块加上默认空间
            fileBlock.forEach( function ( block ) {

                if ( !block.hasOwnProperty( 'unfile' ) ) {

                    fileKeyWord.forEach( function ( keyword ) {

                        if ( keyword in file && !( keyword in block ) ) {

                            block[ keyword ] = file[ keyword ];

                        }

                    } );

                }

            } );

        },

        toTree: function ( data ) {

            var tree = {};

            data.forEach( function ( block ) {

                data;

                var type = definition.getType( block );
                debugger;

                definition.format( block, type );

                switch ( type ) {

                    case definition.TYPE.METHOD:
                    case definition.TYPE.CONSTRUCTOR:
                        Syntax.methodToTree( block, tree );
                        break;

                    case definition.TYPE.EVENT:
                        Syntax.eventToTree( block, tree );
                        break;

                    case definition.TYPE.PROPERTY:
                        Syntax.propertyToTree( block, tree );
                        break;

                    case definition.TYPE[ 'CLASS' ]:
                        Syntax.classToTree( block, tree );
                        break;

                    case definition.TYPE.MODULE:
                        Syntax.moduleToTree( block, tree );
                        break;

                }

            } );

            debugger;

            return tree;

        },

        //把method附加到指定的“树”上去
        methodToTree: function ( methodBlock, tree ) {

            this.memberToTree( methodBlock, tree );


        },

        //把event附加到指定的“树”上去
        eventToTree: function ( eventBlock, tree ) {

            this.memberToTree( eventBlock, tree );

        },

        propertyToTree: function ( propertyBlock, tree ) {

            this.memberToTree( propertyBlock, tree );

        },

        classToTree: function ( classBlock, tree ) {

            var root = null;

            if ( !tree[ classBlock.module ] ) {
                tree[ classBlock.module ] = {};
            }

            root = tree[ classBlock.module ];

            if ( !root[ 'class' ] ) {
                root[ 'class' ] = {};
            }

            root = root[ 'class' ];

            if ( !root[ classBlock.name ] ) {
                root[ classBlock.name ] = {};
            }

            $.merge( root[ classBlock.name ], classBlock );

        },

        moduleToTree: function ( block, tree ) {

            if ( !tree[ block.name ] ) {

                tree[ block.name ] = block;

            } else {

                $.merge( tree[ block.name ], block );

            }

        },

        memberToTree: function ( block, tree ) {

            var root = null;

            if ( !tree[ block.module ] ) {
                tree[ block.module ] = {};
            }

            root = tree[ block.module ];

            //类成员
            if ( block.hasOwnProperty( "class" ) ) {

                if ( !root.hasOwnProperty( "class" ) ) {
                    root[ 'class' ] = {};
                }

                root = root[ 'class' ];

                if ( !root.hasOwnProperty( block[ 'class' ] ) ) {
                    root[ block[ 'class' ] ] = {};
                }

                root = root[ block[ 'class' ] ];

            }


            if ( !root.__member ) {
                root.__member = [];
            }

            root.__member.push( block );

        }

    };

    module.exports = {

        parse: function ( data ) {

            var trees = {};

            debugger;
            $.forOwn( data, function ( block, filepath ) {

                trees[ filepath ] = Syntax.parseSingleFile( block );

            } );

            debugger;
            return Syntax.merge( trees );

        }

    };

} )();
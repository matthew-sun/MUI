( function() {

    var Doc = require('./doc.js'),
        doc = new Doc( {
            files: [ '../src/*.js' ],
            outputDir: '/home/hn/gmudoc/output'
        } ),
        fs = require('fs');
        doc.run();

} )();
(function() {
    'use strict';

    var Doc = require('doc.js');


    var doc = new Doc();

    // doc.setCollector();
    // doc.setParser();
    // doc.setOrganizer();
    // doc.setBuilder();

    doc.run({
        cwd: '../../gmu/src/',
        files: ['core/*.js'],
        themeDir: 'themes/gmu',
        outputDir: '../output',
        markdown: true
    });
})();
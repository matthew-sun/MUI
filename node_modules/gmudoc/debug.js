(function() {
    'use strict';

    var Doc = require('./lib/doc.js');

    var ins = new Doc({
        cwd: '../gmu/src',
        files: [ 'core/*.js', 'widget/popover/*.js', 'zeptodoc/core.js', 'zeptodoc/ajax.js', 'zeptodoc/*.js'],
        theme: 'gmu'
    });

    ins.run();

})();
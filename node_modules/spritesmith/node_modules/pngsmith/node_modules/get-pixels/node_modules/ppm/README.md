ppm
===
This code implements a streaming parser/serializer for ascii [PPM formatted](http://netpbm.sourceforge.net/doc/ppm.html) images in JavaScript.  The PPM file format is very simple and human readable, so it can be useful when debugging graphics applications.  The downside though is that PPM is not a very efficient format, and so it is not really suitable for long term archival or transmission of images.  For those applications, you should use a standard network image format like PNG or JPEG, depending on your requirements.

Usage/Installation
==================
To install, first you do:

    npm install ppm

And here is how you can use it to write/read back an image:

    var ppm = require("ppm");

    var image = [
      [[255, 0, 0], [255, 0, 0], [255, 0, 0]],
      [[0, 255, 0], [0, 255, 0], [0, 255, 0]],
      [[0, 0, 255], [0, 0, 255], [0, 0, 255]]
    ];

    ppm.parse(ppm.serialize(image), function(err, img) {
      console.log(err, img);
    });

The API is streaming, and should be compatible with all the stand node.js features from fs/net/etc..

`ppm.parse(stream, cb(err, result))`
------------------------------------
Parses an ASCII ppm file from the stream.  When finished, calls result with the error/result of parsing the file.

`ppm.serialize(image)`
----------------------
Converts an image into an ASCII ppm stream


Credits
=======
(c) 2013 Mikola Lysenko. BSD

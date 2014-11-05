# QR-PNG [![NPM](https://nodei.co/npm/qrpng.png)](https://nodei.co/npm/qrpng/)

This is a very simple QR-Code generator that outputs a PNG-Buffer. It's written in pure JavaScript.

## Usage

    var qr=require('qrpng');
    qr('this is a sample code', function(err, png) {
      // png contains the PNG as a buffer. You can write it to a file for example.
    });

It has only one function:

    function qr(content[, scale], callback)

scale is the pixel extent of a QR-Code data pixel.

## Install

    npm install qrpng

## License

This uses "QRCode for JavaScript" which Kazuhiko Arase thankfully MIT licensed. This modules is also licensed under MIT license.

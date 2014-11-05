/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

module.exports = makepng;

var crc32 = require('buffer-crc32');
var zlib = require('zlib');

function makepng(data, callback) {
  var width = data[0].length;
  var height = data.length;
  data = IDAT(data, function(err, data) {
    if(err) return callback(err);
    data = [
    header(),
    IHDR(0, 1, width, height),
    data,
    IEND()];
    data = Buffer.concat(data);
    callback(undefined, data);
  });
}

function header() {
  return Buffer('89504E470D0A1A0A', 'hex');
}

function IHDR(colortype, bitdepth, width, height) {
  var ihdr = Buffer(13);
  ihdr.writeUInt32BE(width, 0); // Width: 4 bytes
  ihdr.writeUInt32BE(height, 4); // Height: 4 bytes
  ihdr.writeUInt8(bitdepth, 8); // Bit depth: 1 byte
  ihdr.writeUInt8(colortype, 9); // Color type: 1 byte 0=grayscale
  ihdr.writeUInt8(0, 10); // Compression method: 1 byte
  ihdr.writeUInt8(0, 11); // Filter method: 1 byte
  ihdr.writeUInt8(0, 12); // Interlace method: 1 byte
  return chunkify('IHDR', ihdr);
}

function IDAT(data, callback) {
  data = data.map(function(line) {
    line = bitmap(line);
    line.unshift(0);
    return Buffer(line);
  });
  data = Buffer.concat(data);
  zlib.deflate(data, function(err, data) {
    if(err) return callback(err);
    callback(undefined, chunkify('IDAT', data));
  });
}

function bitmap(data) {
  var res = [];
  while(data.length) {
    res.push(bitmapChunk(data.slice(0, 8)));
    data = data.slice(8);
  }
  return res;
}

function bitmapChunk(dat) {
  /*jslint bitwise:true */
  var dbyte = 0;
  dat.forEach(function(bit, idx) {
    bit = !bit ? 0x01 : 0x00;
    dbyte = dbyte | (bit << (7 - idx));
  });
  return dbyte;
}

function IEND() {
  return chunkify('IEND', Buffer(0));
}

function chunkify(type, buf) {
  var len = bufInt32(buf.length);
  buf = Buffer.concat([Buffer(type.substr(0, 4), 'ascii'), buf], buf.length + 4);
  var crc = bufInt32(crc32.unsigned(buf));
  return Buffer.concat([len, buf, crc], len.length + buf.length + crc.length);
}

function bufInt32(val) {
  var res = Buffer(4);
  res.writeUInt32BE(val, 0);
  return res;
}

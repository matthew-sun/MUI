/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

module.exports = makeQR;

var QRCode = require('./lib/qrcode.js').QRCode;
var PNG = require('./lib/makepng.js');

function makeQR(text, scale, callback) {
  if(('function' === typeof scale) && !callback) {
    callback = scale;
    scale = 1;
  }
  text = text.substr(0, 1273);
  var qr = new QRCode(level(text), 2);
  qr.addData(text);
  qr.make();
  qr = code(qr, scale);
  PNG(qr, callback);
}

function code(qr, scale) {
  var res = [];
  var mods = qr.getModuleCount();
  var idx, idy;
  var l;
  for(idy = 0; idy < scale * 2; idy += 1) {
    res.push(blankline(qr, scale));
  }
  for(idx = 0; idx < mods; idx += 1) {
    for(idy = 0; idy < scale; idy += 1) {
      l = line(qr, idx, scale);
      res.push(l);
    }
  }
  for(idy = 0; idy < scale * 2; idy += 1) {
    res.push(blankline(qr, scale));
  }
  return res;
}

function blankline(qr, scale) {
  var mods = qr.getModuleCount();
  var res = [];
  var idx, idy;
  for(idy = 0; idy < scale * 2; idy += 1) {
    res.push(0);
  }
  for(idx = 0; idx < mods; idx += 1) {
    for(idy = 0; idy < scale; idy += 1) {
      res.push(0);
    }
  }
  for(idy = 0; idy < scale * 2; idy += 1) {
    res.push(0);
  }
  return res;
}

function line(qr, l, scale) {
  var mods = qr.getModuleCount();
  var res = [];
  var idx, idy;
  for(idy = 0; idy < scale * 2; idy += 1) {
    res.push(0);
  }
  for(idx = 0; idx < mods; idx += 1) {
    for(idy = 0; idy < scale; idy += 1) {
      res.push(qr.isDark(l, idx) ? 1 : 0);
    }
  }
  for(idy = 0; idy < scale * 2; idy += 1) {
    res.push(0);
  }
  return res;
}

var levels = [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983, 1051, 1093, 1139, 1219, 1273];

function level(text) {
  var res = 9999;
  levels.forEach(function(max, lev) {
    if(max < text.length) return;
    res = Math.min(lev, res);
  });
  if(res >= levels.length) throw(new Error('text too long (max: ' + levels[levels.length - 1] + ')'));
  return res + 1;
}

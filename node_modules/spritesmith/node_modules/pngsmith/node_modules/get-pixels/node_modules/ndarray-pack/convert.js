"use strict"

var ndarray = require("ndarray")
var cwise = require("cwise")

var do_convert = cwise({
  args: ["array", "scalar", "index"],
  body: function(out, a, idx) {
    var v = a
    for(var i=0; i<idx.length-1; ++i) {
      v = v[idx[i]]
    }
    out = v[idx[idx.length-1]]
  }
})

module.exports = function convert(arr) {
  var shape = [], c = arr, sz = 1
  while(c instanceof Array) {
    shape.push(c.length)
    sz *= c.length
    c = c[0]
  }
  if(shape.length === 0) {
    return ndarray([])
  }
  var result = ndarray(new Float64Array(sz), shape)
  do_convert(result, arr)
  return result
}

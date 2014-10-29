var ppm = require("../ppm.js");

var image = [
  [[255, 0, 0], [255, 0, 0], [255, 0, 0]],
  [[0, 255, 0], [0, 255, 0], [0, 255, 0]],
  [[0, 0, 255], [0, 0, 255], [0, 0, 255]]
];

ppm.parse(ppm.serialize(image), function(err, img) {
  console.log(err, img);
});
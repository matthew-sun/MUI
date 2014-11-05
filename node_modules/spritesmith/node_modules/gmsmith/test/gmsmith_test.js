// Load our dependencies
var gmsmith = require('../lib/gmsmith');
var spritesmithEngineTest = require('spritesmith-engine-test');

// Configure gmsmith for our environment
// DEV: In case it recurs, we had downcasting of imagemagick's spritesheets to 8 bit for `get-pixels` loading
//   See https://github.com/twolfson/gmsmith/blob/0.4.3/test/gmsmith_test_content.js#L39
gmsmith.clearSettings();
if (process.env.TEST_IMAGEMAGICK === 'TRUE') {
  gmsmith.set({imagemagick: true});
} else if (process.env.TEST_IMAGEMAGICK === 'IMPLICIT_WITH_SET') {
  gmsmith.set({});
}

// Run our tests
spritesmithEngineTest.run({
  engine: gmsmith,
  engineName: 'gmsmith',
  options: {
    // If we are on Windows, skip over performance test (it cannot handle the long argument string)
    skipRidiculousImagesTest: process.platform === 'win32'
  }
});

# gmsmith changelog
0.4.4 - Upgraded to `spritesmith-engine-test@2.0.0` and moved to `mocha`

0.4.3 - Upgraded `npm` inside Travis CI to fix `node@0.8` issues

0.4.2 - Repaired legacy logic that caused 0.4.0 patch to fail whenever `.set` was called

0.4.1 - Re-enabling Travis CI tests for all supported node versions

0.4.0 - Implicitly discover `imagemagick` when `gm` doesn't exist and `imagemagick` flag is unspecified

0.3.0 - Added imagemagick to test suite and corrected `preinstall` for `package.json`

0.2.3 - Removed postinstall piping to allow cross-platform

0.2.2 - Integrated Travis CI

0.2.1 - Upgraded `doubleshot` and skipping `imagemagick` tests for approachability

0.2.0 - Added `get/set` support and `imagemagick` flag setting

0.1.3 - See `git log`

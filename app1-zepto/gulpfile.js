const { src, dest, series } = require('gulp');
const filter = require('gulp-filter');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
// const zip = require('gulp-zip');
// const hash = require('gulp-hash-filename');
const del = require('del');
 
const assetFilter = filter(['**', '!**/*.html'], { restore: true });
const srcFolder = 'src';
const distFolder = 'build';
// const archiveName = 'app.zip';

function clean(cb) {
  del([distFolder], cb());
}

function revision() {
  return src(srcFolder + '/**')
    .pipe(assetFilter)
    .pipe(rev())
    .pipe(assetFilter.restore)
		.pipe(revRewrite())
		// .pipe(zip(archiveName))
		// .pipe(hash({
    // 	format: "{name}.{hash:8}{ext}"
    // }))
    .pipe(dest(distFolder))
}
 
exports.default = series(revision);

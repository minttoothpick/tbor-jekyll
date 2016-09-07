var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps   = require('gulp-sourcemaps'),
    cp           = require('child_process');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};



/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
    .on('close', done);
});



/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});



/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});



/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
var sassSources = [
  '_scss',
  '_scss/components'
];

gulp.task('sass', function() {
  return gulp.src('_scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: sassSources,
      onError: browserSync.notify
    }))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('_site/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('css'));
});



/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function() {
  gulp.watch('_scss/**/*', ['sass']);
  gulp.watch(['*.html', '_includes/*.html', '_layouts/*.html', '_posts/*', '_tracks/*'], ['jekyll-rebuild']);
});



/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

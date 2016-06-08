var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('clean', function (cb) {
    del(['build/*.js'], cb)
});

gulp.task('minifyjs', function (cb) {
    return gulp.src('js/*.js')
        .pipe(concat('new.js'))    //合并所有js到new.js
        .pipe(gulp.dest('build'))    //输出new.js到文件夹
        .pipe(rename({ suffix: '.min' }))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('build'));   //输出
});
gulp.task('default',['clean','minifyjs'],function () {
    // gulp.start('minifyjs');
    console.log('world is nice');
});
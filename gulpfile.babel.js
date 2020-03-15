import childProcess from "child_process";
import gulp from "gulp";
import babel from "gulp-babel";
import browserSync from "browser-sync";
import postcss from "gulp-postcss";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import uglify from "gulp-uglify";
import plumber from "gulp-plumber";
import imagemin from "gulp-imagemin";
import del from "del";
import concat from "gulp-concat";
import notify from "gulp-notify";
import sassdoc from "sassdoc";
import tailwindcss from "tailwindcss";

const runserver = () => {
  var proc = childProcess.exec("python manage.py runserver");
};

const server = () => {
  browserSync.init({
    notify: false,
    port: 8000,
    proxy: "localhost:8000"
  });
};

const scss = () => {
  var options = {
    dest: "scssdoc",
    verbose: true,
    display: {
      access: ["public", "private"],
      alias: true,
      watermark: true
    },
    groups: {
      undefined: "Global"
    }
  };
  return gulp
    .src("dev/assets/scss/**/*.scss")
    .pipe(sassdoc(options))
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "" }).on("error", sass.logError))
    .pipe(
      postcss([tailwindcss("./tailwind.config.js"), require("autoprefixer")])
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("app/static/css"));
};

const js = () => {
  return gulp
    .src("dev/assets/js/**/*.js")
    .pipe(
      plumber({
        errorHandler: function(err) {
          notify.onError({
            title: "Gulp error in " + err.plugin,
            message: err.toString()
          })(err);
        }
      })
    )
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(concat("build.js"))
    .pipe(gulp.dest("app/static/js"));
};

//  이미지 용량 최소화
const minImg = () => {
  return gulp
    .src("dev/assets/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("app/static/images"));
};

const plugin = () => {
  return gulp
    .src(["dev/assets/plugins/**/*"], { since: gulp.lastRun(plugin) })
    .pipe(gulp.dest("app/static/plugins"));
};

const watchTask = () => {
  gulp.watch("dev/**/*.scss", scss).on("change", browserSync.reload);
  gulp.watch("dev/**/*.js", js).on("change", browserSync.reload);
  gulp
    .watch("dev/**/*.{jpg,jpeg,png,gif,svg}", minImg)
    .on("change", browserSync.reload);
};

const clean = () => {
  return del("app/static");
};

exports.default = gulp.series(
  clean,
  gulp.parallel(scss, js, minImg, plugin),
  gulp.parallel([runserver, server, watchTask])
);

exports.build = gulp.series(clean, scss, js, minImg, plugin);

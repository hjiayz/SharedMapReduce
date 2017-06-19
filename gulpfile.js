var gulp = require('gulp');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var webpack = require('webpack');
var gulpwebpack = require('webpack-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var WebpackDevServer = require("webpack-dev-server");
var path = require('path');
var gutil = require("gulp-util");
var webpackOptions={
    entry: {
        index : ['./src/index.js']
    },
    output: {
        filename : "bundle.js",
        library : "SharedMapReduce",
        libraryTarget : "umd"
    },
    module: {
        loaders: [    
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
    },
    resolve: {
      root: './src'
    }
};
var testOptions={
    entry: {
        index : [
          './src/test/test.js'
        ]
    },
    output: {
        filename : "webtest.js",
        path: path.join(__dirname, "dist"),
        publicPath: "/public/"
    },
    devServer: {
        contentBase: "public/"
    },
    module: {
        loaders: [    
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
              presets: ['es2015']
            }
          }
        ]
    },
    resolve: {
      root: './src'
    },
    plugins:[new webpack.NormalModuleReplacementPlugin(/\.\.\/index\.js/,"../../dist/bundle.js")]
};


gulp.task('webpack', function () {
  return gulp.src(['./src/index.js'])
    .pipe(gulpwebpack(webpackOptions))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({extname:".min.js"}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('node', function () {
  return gulp.src('./src/**/*!(.browser).js')
    .pipe(babel({presets:"es2016-node5"}))
    .pipe(gulp.dest('./'))
});

 gulp.task("webtest", function(callback) {
   var myConfig = Object.create(testOptions);
   new WebpackDevServer(webpack(myConfig), {
    publicPath: "/" + myConfig.output.publicPath,
    stats: {
      colors: true
    }
   }).listen(8080, "127.0.0.1", function(err) {
    if (err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://127.0.0.1:8080/webpack-dev-server/index.html");
   });
 });

gulp.task('lint', function  () {
  gulp.src('./src/**/*.js')
    .pipe(eslint({
      "parser": "babel-eslint",
      "rules": {
        "strict": 0
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
gulp.task('default', function(){
  gulp.run('node','webpack');
});
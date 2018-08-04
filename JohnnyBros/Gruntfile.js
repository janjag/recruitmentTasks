const sass = require("node-sass");
const mozjpeg = require('imagemin-mozjpeg');

module.exports = function (grunt) {
  grunt.initConfig({

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "assets/*.css",
            "*.html",
            "assets/*.js"
          ]
        },
        options: {
          watchTask: true,
          server: "./",
          directory: true,
          ui: {
            port: 8889,
            weinre: {
              port: 9999
            }
          },
          port: 8888
        }
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require("autoprefixer")({
            browsers: ["last 20 versions", "ie 7-11"]
          })
        ]
      },
      dist: {
        src: "assets/*.css"
      }
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
        outputStyle: "compressed"
      },
      dist: {
        files: {
          "assets/main.min.css": "dev/scss/main.scss"
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        compress: {
          drop_console: true
        }
      },
      prod: {
        files: {
          "assets/app.min.js": ["dev/js/app.js"]
        }
      }
    },
    imagemin: {
      dynamic: {
        options: {
            optimizationLevel: 3,
            svgoPlugins: [{removeViewBox: false}],
            use: [mozjpeg()]
        },
        files: [{
            expand: true,
            src: ['img/*.{png,jpg,gif}'],
            dest: 'assets/'
        }]
      }
    },
    watch: {
      js: {
        files: "dev/**/*.js",
        tasks: ["uglify"]
      },
      css: {
        files: "dev/**/*.scss",
        tasks: ["sass", "postcss:dist"]
      },
      img: {
        files: ["dev/img/*.jpg", "dev/img/*.png"],
        tasks: ["imagemin"]
      }
    }
  });


  grunt.loadNpmTasks("grunt-browser-sync");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask("default", ["browserSync", "watch"]);
  grunt.registerTask("build-css", ["sass", "postcss:dist"]);
  grunt.registerTask("build-js", ["uglify"]);
  grunt.registerTask("build-img", ["imagemin"]);
}; 
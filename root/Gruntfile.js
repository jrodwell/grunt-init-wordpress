/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

(function () {
  'use strict';
  module.exports = function(grunt) {

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      // Minify js
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          '<%= pkg.path.js %>/main.min.js': ['<%= pkg.path.js %>/main.js']
        }
      },
      // Run js through jshint
      jshint: {
        files: ['gruntfile.js', 'styleguide/styleguide-js/main.js', '<%= pkg.path.js %>/main.js'],
        options: {
          globals: {
            jQuery: true,
            console: true,
            module: true,
            document: true
          }
        }
      },
      // Run a local server
      connect: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          base: 'styleguide',
          keepalive: true
        },
        middleware: function(connect, options) {
          return connect.static(options.base);
        }
      },
      // Manage Sass compilation
      sass: {                              // Task
        dist: {                            // Target
          options: {
            quiet: false,
            cacheLocation: '<%= pkg.path.scss %>/.sass-cache'
          },
          files: {                         // Dictionary of files
            '<%= pkg.path.css %>/style.css': '<%= pkg.path.scss %>/style.scss'       // 'destination': 'source'
          }
        }
      },
      // Replace text in files
      replace: {
        text: {
          src: ['<%= pkg.path.theme %>/**/*.php', '<%= pkg.path.theme %>/**/*.scss'],             // source files array (supports minimatch)
          overwrite: true,
          replacements: [{
            from: 'theme_name',
            to: '{%= theme_name %}'
          }, {
            from: /Theme Name/g,
            to: '{%= title %}'
          }]
        },
        move: {
          src: ['styleguide/css'],
          dest: ['<%= pkg.path.theme %>']
        }
      },
      // Create symlinks
      symlink: {
        css: {
          dest: 'styleguide/style.css',
          relativeSrc: '..<%= pkg.path.theme %>'
        },
        cssdir: {
          dest: 'styleguide/css',
          relativeSrc: '..<%= pkg.path.css %>',
          options: {type: 'dir'} // 'file' by default
        },
        jsdir: {
          dest: 'styleguide/js',
          relativeSrc: '..<%= pkg.path.js %>',
          options: {type: 'dir'} // 'file' by default
        },
        imgdir: {
          dest: 'styleguide/img',
          relativeSrc: '..<%= pkg.path.img %>',
          options: {type: 'dir'} // 'file' by default
        }
      },
      // Optimise images
      imageoptim: {
        files: [
          '<%= pkg.path.img %>'
        ],
        options: {
          // also run images through ImageAlpha.app before ImageOptim.app
          imageAlpha: true,
          // also run images through JPEGmini.app after ImageOptim.app
          // jpegMini: true,
          // quit all apps after optimisation
          quitAfter: true
        }
      },
      // Watch for changes to files
      watch: {
        gruntfile: {
          files: 'Gruntfile.js',
          tasks: ['jshint']
        },
        css: {
          files: ['<%= pkg.path.scss %>/**/*.scss'],
          tasks: ['sass']
        },
        styleguide: {
          files: ['styleguide/styleguide-js/main.js', '<%= pkg.path.js %>/main.js'],
          tasks: ['jshint']
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-imageoptim');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-symlink');

    grunt.registerTask('init-wordpress', ['replace', 'symlink']);

    grunt.registerTask('server', ['connect']);

    grunt.registerTask('test', ['sass', 'jshint']);

    grunt.registerTask('optim', ['imageoptim']);

    grunt.registerTask('default', ['sass', 'jshint', 'uglify']);

  };
}());
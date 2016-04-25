module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: ['dist/','bower_components/', 'lib/'],
      temp: ['dist/private/js-annotated/']
    },
    bower: {
      install: {
        options: {
          install: true,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },
    jshint: {
      dist: {
        src: ['private/**/*.js', '!private/bower_components/**/*.js']
      }
    },
    ngAnnotate: {
      options: {
          singleQuotes: true
      },
      app: {
        files: [
          {expand: true, src: ['private/**/*.js', '!private/bower_components/**/*.js'], dest: 'dist/private/js-annotated/'}
        ]
      }
    },
    uglify: {
      scripts: {
        src: ['dist/private/js-annotated/private/js/flexApp.js',
          'dist/private/js-annotated/private/js/controller/*.js',
          'dist/private/js-annotated/private/js/directives/*.js',
          'dist/private/js-annotated/private/js/services/*.js'
        ],
        dest: 'dist/private/js/scripts.min.js'
      }
    },
    cssmin: {
      all: {
        src: ['private/css/**/*.css'],
        dest: 'dist/private/css/style.min.css'
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      views: {
        expand: true,
        cwd: 'private/view/',
        src: ['**/*.html'],
        dest: 'dist/private/view'
      }
    },
    copy: {
      private: {
        src: 'private/index-prod.html',
        dest: 'dist/private/index.html'
      },
      public: {
        files: [
          {expand: true, cwd: 'public/', src: ['**'], dest: 'dist/public/'}
        ]
      },
      bower: {
        files: [
          {expand: true, src: ['bower_components/**'], dest: 'dist/private/'},
          {expand: true, src: ['bower_components/AdminLTE/**', 'bower_components/angular/**'], dest: 'dist/public/login'}
        ]
      },
      web: {
        files: [
          {expand: true, cwd: 'dist/', src: ['**'], dest: '../web/'}
        ]
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('prod', [
    'clean:all',
    'bower:install',
    'jshint',
    'ngAnnotate',
    'uglify',
    'cssmin',
    'htmlmin',
    'clean:temp',
    'copy',
    'clean:all'
  ]);
}

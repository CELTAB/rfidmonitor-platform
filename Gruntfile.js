module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      before: ['web', 'web-dev/dist/','bower_components/', 'lib/'],
      after: ['web-dev/dist/','bower_components/', 'lib/'],
      temp: ['web-dev/dist/private/js-annotated/']
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
        src: ['web-dev/private/**/*.js', '!web-dev/private/bower_components/**/*.js']
      }
    },
    ngAnnotate: {
      options: {
          singleQuotes: true
      },
      app: {
        files: [
          {expand: true, src: ['web-dev/private/**/*.js', '!web-dev/private/bower_components/**/*.js'], dest: 'web-dev/dist/private/js-annotated/'}
        ]
      }
    },
    uglify: {
      scripts: {
        src: ['web-dev/dist/private/js-annotated/web-dev/private/js/flexApp.js',
          'web-dev/dist/private/js-annotated/web-dev/private/js/controller/*.js',
          'web-dev/dist/private/js-annotated/web-dev/private/js/directives/*.js',
          'web-dev/dist/private/js-annotated/web-dev/private/js/services/*.js'
        ],
        dest: 'web-dev/dist/private/js/scripts.min.js'
      }
    },
    cssmin: {
      all: {
        src: ['web-dev/private/css/**/*.css'],
        dest: 'web-dev/dist/private/css/style.min.css'
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      views: {
        expand: true,
        cwd: 'web-dev/private/view/',
        src: ['**/*.html'],
        dest: 'web-dev/dist/private/view'
      }
    },
    copy: {
      private: {
        src: 'web-dev/private/index-prod.html',
        dest: 'web-dev/dist/private/index.html'
      },
      public: {
        files: [
          {expand: true, cwd: 'web-dev/public/', src: ['**'], dest: 'web-dev/dist/public/'}
        ]
      },
      bower: {
        files: [
          {expand: true, src: ['bower_components/**'], dest: 'web-dev/dist/private/'},
          {expand: true, src: ['bower_components/AdminLTE/**', 'bower_components/angular/**'], dest: 'web-dev/dist/public/login'}
        ]
      },
      web: {
        files: [
          {expand: true, cwd: 'web-dev/dist/', src: ['**'], dest: 'web/'}
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

  grunt.registerTask('default', [
    'clean:before',
    'bower:install',
    'jshint',
    'ngAnnotate',
    'uglify',
    'cssmin',
    'htmlmin',
    'clean:temp',
    'copy',
    'clean:after'
  ]);
}

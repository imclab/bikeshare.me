module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      app: {
        options: {
          banner:
            '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * <%= pkg.author.name %>\n' +
            ' * <%= pkg.repository.url %>\n' +
            ' * License: <%= pkg.license %>\n' +
            ' */\n\n'
        },
        files: {
          'app/build/app.js': [
            'app/js/init/*.js',
            'app/js/config/*.js',
            'app/js/models/*.js',
            'app/js/views/*.js',
            'app/js/controllers/*.js',
            'app/js/routers/*.js',
            'app/js/application/*.js',
            'app/js/modules/*.js',
            'app/js/main.js'
          ]
        }
      },
      components: {
        files: {
          'app/build/components.min.js': [
            'app/bower_components/jquery/jquery.min.js',
            'app/bower_components/lodash/dist/lodash.underscore.min.js',
            'app/bower_components/backbone/backbone-min.js',
            'app/bower_components/backbone.localStorage/backbone.localStorage-min.js',
            'app/bower_components/backbone.marionette/lib/backbone.marionette.min.js',
            'app/bower_components/typeahead.js/dist/typeahead.min.js',
            'app/bower_components/jquery-timeago/jquery.timeago.min.js',
            'app/bower_components/jquery-ui/ui/minified/jquery.ui.core.min.js',
            'app/bower_components/jquery-ui/ui/minified/jquery.ui.widget.min.js',
            'app/bower_components/jquery-ui/ui/minified/jquery.ui.mouse.min.js',
            'app/bower_components/jquery-ui/ui/minified/jquery.ui.sortable.min.js',
            'app/bower_components/jquery-ui/ui/minified/jquery.ui.droppable.min.js',
            'app/bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min.js',
            'app/bower_components/base62/base62.min.js'
          ]
        }
      }
    },

    jshint: {
      options: {
        camelcase: true,
        curly: true,
        devel: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        plusplus: true,
        quotmark: true,
        strict: false,
        trailing: true,
        undef: true,
        unused: true
      },
      app: {
        options: {
          browser: true,
          globals: {
            '_': true,
            'Backbone': true,
            'Marionette': true,
            'Base62': true,
            'JST': true
          },
          jquery: true
        },
        files: {
          src: ['app/build/app.js']
        }
      }
    },

    uglify: {
      app: {
        options: {
          // Cannot use banner with source map (grunt-contrib-uglify #22).
          // banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n',
          preserveComments: 'some',
          sourceMap: 'app/build/app.js.map',
          sourceMapRoot: '/',
          sourceMapPrefix: 1,
          sourceMappingURL: '/build/app.js.map'
        },
        files: {
          'app/build/app.min.js': [
            'app/js/banner.txt',
            'app/js/init/*.js',
            'app/js/config/*.js',
            'app/js/templates/*.js',
            'app/js/models/*.js',
            'app/js/views/*.js',
            'app/js/controllers/*.js',
            'app/js/routers/*.js',
            'app/js/application/*.js',
            'app/js/modules/*.js',
            'app/js/main.js'
          ]
        }
      },
      components: {
        files: {
          'app/bower_components/jquery-timeago/jquery.timeago.min.js': [
            'app/bower_components/jquery-timeago/jquery.timeago.js'
          ]
        }
      }
    },

    // Fix Uglify's inability to cope with a subdirectory webroot.
    "string-replace": {
      fix: {
        files: {
          'app/build/app.js.map': 'app/build/app.js.map'
        },
        options: {
          replacements: [{
            pattern: '"file":"app/build/app.min.js"',
            replacement: '"file":"build/app.min.js"'
          }]
        }
      }
    },

    cssmin: {
      add_banner: {
        files: {
          'app/css/main.min.css': [
            'app/css/main.css'
          ],
          'app/css/faq.min.css': [
            'app/css/faq.css'
          ]
        }
      }
    },

    jst: {
      templates: {
        files: {
          'app/js/templates/compiled-templates.js': [
            'app/js/templates/*.tmpl'
          ]
        }
      }
    },

    manifest: {
      generate: {
        options: {
          basePath: 'app/',
          cache: [
            'http://themes.googleusercontent.com/static/fonts/lato/v6/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff',
            'http://themes.googleusercontent.com/static/fonts/lato/v6/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff'
          ],
          network: ['*'],
          fallback: ['/ /'],
          verbose: true,
          timestamp: true
        },
        src: [
          'build/components.min.js',
          'build/app.min.js',
          'css/main.min.css'
        ],
        dest: 'app/cache.manifest'
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'app'
        }
      }
    },

    watch: {
      html: {
        options: {
          livereload: true
        },
        tasks: ['manifest'],
        files: ['app/index.html']
      },
      templates: {
        options: {
          livereload: true
        },
        tasks: [
          'templates'
        ],
        files: [
          'app/js/templates/*.tmpl'
        ]
      },
      javascript: {
        options: {
          livereload: true
        },
        tasks: [
          'concat:app',
          'jshint',
          'uglify:app',
          'string-replace:fix',
          'manifest'
        ],
        files: [
          'app/js/**/*.js'
        ]
      },
      css: {
        options: {
          livereload: true
        },
        tasks: [
          'cssmin',
          'manifest'
        ],
        files: [
          'app/css/main.css',
          'app/css/faq.css'
        ]
      }
    }

  });

  // Register tasks.
  grunt.registerTask(
    'default',
    [
      'concat:app',
      'jshint',
      'jst',
      'uglify:app',
      'string-replace:fix',
      'cssmin',
      'manifest'
    ]
  );

  grunt.registerTask('setup', ['components']);
  grunt.registerTask('components', ['uglify:components', 'concat:components']);
  grunt.registerTask('dev', ['default', 'connect', 'watch']);

};

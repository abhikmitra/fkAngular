module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            all: ['src/**/*.js'],
            options: {
                globals: {
                    _: false,
                    $: false
                },
                browser: true,
                devel: true
            }
        },
        jasmine: {
            unit: {
                src: 'src/**/*.js',
                options: {
                    specs: ['test/**/*.js'],
                    vendor: ['node_modules/lodash/lodash.js',
                        'node_modules/jquery/dist/jquery.js'
                    ]

                }
            }
        },
        watch: {
            all: {
                files: ['src/**/*.js', 'test/**/*.js'],
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-notify');
    grunt.registerTask('default', ['jshint', 'jasmine']);


}
;
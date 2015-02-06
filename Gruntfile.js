module.exports = function (grunt) {



    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> v<%= pkg.version %> \n (coffee) Copyright 2014 Backand All rights reserved. https://backand.com \n License: MIT\n */\n'
            },
            js: {
                src: 'dist/<%= pkg.name %>.debug.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }

        },


        concat: {
            options: {
                banner: '/*\n <%= pkg.name %> v<%= pkg.version %> \n (coffee) Copyright 2014 Backand All rights reserved. https://backand.com \n License: MIT\n */\n'
            },

            js: {
                options: {
                    separator: ';'
                },
                src: [
                'src/restangularbknd.js',
                'src/auth.js',
                'src/session.js',
                'src/angularfileuploadbknd.js'
                ],
                dest: 'dist/<%= pkg.name %>.debug.js'
            }
        }

    });


    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');


    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};
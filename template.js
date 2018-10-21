/*
 * grunt-init-wordpress
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 Fixate, contributors - modified by J.R.
 * Licensed under the MIT license.
 */

'use strict';

// File system and HTTP node libraries
var http = require('http');
var https = require('https');
var fs = require('fs');

// Basic template description.
exports.description = 'Create a WordPress project.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '_Project name_ is used to localise the WordPress install.' +
  '\n\n'+
  '_Project title_ should be a human-readable title' +
  '\n\n'+
  'You will need to run *npm install*, followed by *grunt init-wp* ' +
  'to configure localisations, symlinks, and file and folder structures ' +
  'once this template has run.';

// Template-specific notes to be displayed after question prompts.
exports.after = '*** WordPress project installed! ***' +
  '\n\n' +
  'run *npm install* to install dependencies. Then: ' +
  '\n\n' +
  'run *grunt init-wp* to configure your WordPress install.' +
  '\n\n' +
  'For more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    {
      name: 'theme_folder',
      message: 'Theme folder name:',
      validator: /^[\w\-\.]+$/,
      warning: 'Must be only letters, numbers, dashes, dots or underscores.',
      default: 'my-theme'
    },
    {
      name: 'theme_local',
      message: 'Theme localisation name:',
      validator: /^[\w\-\.]+$/,
      warning: 'Must be only letters, numbers, dashes, dots or underscores.',
      default: 'my_theme'
    },
    init.prompt('title', 'J.R. Theme'),
    init.prompt('version', '1.0.0'),
    init.prompt('homepage', 'index.php'),
    init.prompt('author_name'),
    init.prompt('author_email', 'john@nicetechnology.co.uk'),
    init.prompt('author_url'),
    init.prompt('db_name'),
    init.prompt('db_user', 'root'),
    init.prompt('db_password', 'jr8073421'),
    init.prompt('db_host', 'localhost')
  ], function(err, props) {

    props.keywords = [];

	// Generate security keys via HTTP request...

	https.get('https://api.wordpress.org/secret-key/1.1/salt', function(res) {
        
        var str = '';
        //console.log('Response is '+res.statusCode);

        res.on('data', function(chunk) {
               str += chunk;
         });

        res.on('end', function() {
             console.log(str);
             props.security_keys = str;
        });

  	});

	//props.security_keys = 'TEMPKEYS';

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {noProcess: ['src/wp-includes/**/*', 'src/wp-admin/**/*', 'src/wp-content/plugins/**/*']});

    // Generate package.json file, used by npm and grunt.
	init.writePackageJSON('package.json', {
		node_version: '>= 0.10.0',
		devDependencies: devDependencies
	});

    // All done!
    done();
  });

};

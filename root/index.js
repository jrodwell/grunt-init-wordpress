
	// Test getting security keys...

	'use strict';
	
	// File system and HTTP node libraries
	var http = require('http');
	var https = require('https');
	var fs = require('fs');

	// Generate security keys via HTTP request...

	https.get('https://api.wordpress.org/secret-key/1.1/salt', function(res) {
        
        var str = '';
        //console.log('Response is '+res.statusCode);

        res.on('data', function(chunk) {
               str += chunk;
         });

        res.on('end', function() {
             console.log(str);
        });

  	});
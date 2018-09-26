#!/usr/bin/env node

var http        = require('http');
var https       = require('https');
var mockserver  = require('./../mockserver');
var argv        = require('yargs').argv;
var colors      = require('colors')
var fs          = require('fs')
var info        = require('./../package.json');
var mocks       = argv.m || argv.mocks;
var port        = argv.p || argv.port;
var verbose     = !(argv.q || argv.quiet);

var ssl         = argv.ssl;
var cert        = argv.cert;
var key         = argv.key;

if (!mocks || !port) {
  console.log([
    "Mockserver v" + info.version,
    "",
    "Usage:",
    "  mockserver [-q] -p PORT -m PATH",
    "",
    "Options:",
    "  -p, --port=PORT    - Port to listen on",
    "  -m, --mocks=PATH   - Path to mock files",
    "  -q, --quiet        - Do not output anything",
    "  --ssl --cert=[cert] --key=[key] - Use SSL",
    "",
    "Example:",
    "  mockserver -p 8080 -m './mocks'"
  ].join("\n"));
} else {
  if(ssl) {
    var options = {
      key: fs.readFileSync(key),
      cert: fs.readFileSync(cert)
    };
    https.createServer(options, mockserver(mocks, verbose)).listen(port);
  } else {
    http.createServer(mockserver(mocks, verbose)).listen(port);
  }

  if (verbose) {
    console.log('Mockserver serving mocks {'
      + 'verbose'.yellow + ':' + (verbose && 'true'.green || 'false')
      + '} under "' + mocks.green  + '" at '
      + ((ssl && 'https' || 'http') + '://localhost:' + port.toString()).green);
  }
}

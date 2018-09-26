var fs = require('fs')
var path = require('path')
var createCert = require('./createCert')

// borrowed from webpack-dev-server

generateFakeCert = function() {
  // Use a self-signed certificate if no certificate was configured.
  // Cycle certs every 24 hours
  const certPath = path.join(__dirname, '../ssl/server.pem');

  let certExists = fs.existsSync(certPath);

  if (certExists) {
    const certTtl = 1000 * 60 * 60 * 24;
    const certStat = fs.statSync(certPath);

    const now = new Date();

    // cert is more than 30 days old, kill it with fire
    if ((now - certStat.ctime) / certTtl > 30) {
      console.log('SSL Certificate is more than 30 days old. Removing.');

      del.sync([certPath], { force: true });

      certExists = false;
    }
  }

  if (!certExists) {
    console.log('Generating self-signed SSL Certificate');

    const attrs = [
      { name: 'commonName', value: 'localhost' }
    ];

    const pems = createCert(attrs);

    fs.writeFileSync(
      certPath,
      pems.private + pems.cert,
      { encoding: 'utf-8' }
    );
  }

  const fakeCert = fs.readFileSync(certPath);
  return fakeCert
}

module.exports = generateFakeCert;
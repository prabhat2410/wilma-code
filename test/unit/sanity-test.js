//const should = require('should');
//const mocha = require('mocha');

/* Richa: process.env.PEP_PROXY_IDM_PORT = 3000;
process.env.PEP_PROXY_IDM_HOST = 'localhost';
process.env.PEP_PROXY_IDM_SSL_ENABLED = false;
process.env.PEP_PROXY_USERNAME =
  'pep_proxy_00000000-0000-0000-0000-000000000000';
process.env.PEP_PASSWORD = 'test';
*/

process.env.PEP_PROXY_IDM_PORT = 3000;
process.env.PEP_PROXY_IDM_HOST = '192.168.100.171';
process.env.PEP_PROXY_IDM_SSL_ENABLED = false;
process.env.PEP_PROXY_USERNAME =
  'pep_proxy_0cc0f32e-7345-4c95-b1d3-4136e248fdad';
process.env.PEP_PASSWORD = 'pep_proxy_9c395ca1-00e5-4525-af04-bec27cccbe23';

const config = require('./../../config');
const IDM = require('./../../lib/idm.js').IDM;
const AZF = require('./../../lib/azf.js').AZF;

const log = require('./../../lib/logger').logger.getLogger('Test');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Sanity Checks for Wilma PEP Proxy - Identity Manager Checks', function() {
  describe('Testing Keyrock configuration', function() {
    it('should have PEP user configured', function(done) {
      if (config.pep.username !== undefined && config.pep.username !== '') {
        if (config.pep.password !== undefined && config.pep.password !== '') {
          done();
        }
      }
    });
  });

  describe('Testing connection with Keyrock', function() {
    it('should have connectivity with Keyrock', function(done) {
      IDM.checkConn(
        function(status) {
          if (status === 200) {
            done();
          }
        },
        function(status, e) {
          log.error('Error in Keyrock communication', e);
        }
      );
    });

    it('should authenticate with Keyrock', function(done) {
      IDM.authenticate(
        () => {
          done();
        },
        function(status, e) {
          log.error('Error in Keyrock communication', e);
        }
      );
    });
  });
});

describe('Sanity Checks for Wilma PEP Proxy - AuthZForce Checks', function() {
  if (
    config.authorization.enabled &&
    config.authorization.pdp === 'authzforce'
  ) {
    describe('Testing configuration', function() {
      it('should have AZF server configured', function(done) {
        if (config.azf.host !== undefined && config.azf.host !== '') {
          if (config.azf.port !== undefined && config.azf.port !== '') {
            done();
          }
        }
      });
    });

    describe('Testing connection with AZF', function() {
      it('should have connectivity with AZF', function(done) {
        AZF.checkConn(
          function() {},
          function(status) {
            if (status === 401) {
              done();
            }
          }
        );
      });
    });
  } else {
    it('AZF not enabled', function(done) {
      done();
    });
  }
});

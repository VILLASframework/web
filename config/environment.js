/* jshint node: true */

module.exports = function(environment) {
  /*********************************
   * This variable must be set to the address the server should be available on.
   */
  var hostAddress = 'localhost';
  /*
   *
   *********************************/

  var ENV = {
    modulePrefix: 'lab-mashup',
    environment: environment,
    baseURL: '/',
    locationType: 'none',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      UPDATE_RATE: 200,
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-eval'",
      'font-src': "'self'",
      'connect-src': "'self'",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'media-src': "'self'"
    },

    'ember-cli-mirage': {
      enabled: false
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    hostAddress = '192.168.99.100'; // docker-machine ip address (only when using docker on a mac)

    ENV.contentSecurityPolicy['script-src'] += " " + hostAddress + ":80";
    ENV.contentSecurityPolicy['connect-src'] += " ws://" + hostAddress + ":49152";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  ENV.APP.API_HOST = 'http://' + hostAddress + ':80';

  // add api host to allowed connect src
  ENV.contentSecurityPolicy['connect-src'] += " " + hostAddress + ":80";

  return ENV;
};

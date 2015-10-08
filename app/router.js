import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('lab-mashup', { path: '/' }, function() {
      // dynamic routes
      this.route('entity', { path: '/:entity_id' }, function() {
        this.route('property', { path: '/:property_id'});
      });

      // static routes
      this.route('static1', { path: '/static1' });
      this.route('static2', { path: '/static2' });
    });
});

export default Router;

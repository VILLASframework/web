import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('entities', { path: '/' }, function() {
      this.route('entity', { path: '/:entity_id' }, function() {
        this.route('property', { path: '/:property_id'});
      });
    });
});

export default Router;

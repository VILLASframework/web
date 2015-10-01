import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('lab-mashup', { path: '/' }, function() {
      this.route('entity', { path: '/:entity_id' });
    });
});

export default Router;

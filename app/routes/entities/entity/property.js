import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    console.log("property: " + params.property_id);
    return this.store.findRecord('property', params.property_id);
  }
});

import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    console.log("entity: " + params.entity_id);
    return this.store.findRecord('entity', params.entity_id);
  }
});

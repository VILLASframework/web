import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    console.log('entities');
    return this.store.findAll('entity');
  }
});

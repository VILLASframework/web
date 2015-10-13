import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.query('entity', { entities: [
      {
        id: 'S1_ElectricalGrid',
        isPattern: false,
        type: 'ElectricalGridMonitoring'
      },
      {
        id: 'S2_ElectricalGrid',
        isPattern: false,
        type: 'ElectricalGridMonitoring'
      }
    ]});
    //return this.store.findAll('entity');
  },

  afterModel() {
    // first time call poll
    Ember.run.later(this, function() {
      this.refreshEntities();
    }, 100);
  },

  refreshEntities: function() {
    // fetch new data from server
    this.store.query('entity', { entities: [
      {
        id: 'S3_ElectricalGrid',
        isPattern: false,
        type: 'ElectricalGridMonitoring'
      },
      {
        id: 'S2_ElectricalGrid',
        isPattern: false,
        type: 'ElectricalGridMonitoring'
      }
    ]});
    //this.store.findAll('entity');

    // reschedule refresh
    Ember.run.later(this, function() {
      this.refreshEntities();
    }, 100);
  }
});

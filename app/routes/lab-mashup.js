import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Route.extend({
  model() {
    return this.store.query('entity', { entities: [
      {
        id: 'S1_ElectricalGrid',
        isPattern: false,
        type: ''
      },
      {
        id: 'S2_ElectricalGrid',
        isPattern: false,
        type: ''
      },
      {
        id: 'S3_ElectricalGrid',
        isPattern: false,
        type: ''
      }
    ]});
    //return this.store.findAll('entity');
  },

  afterModel() {
    // first time call poll
    Ember.run.later(this, function() {
      this.refreshEntities();
    }, ENV.APP.UPDATE_RATE);
  },

  refreshEntities: function() {
    // fetch new data from server
    this.store.query('entity', { entities: [
      {
        id: 'S1_ElectricalGrid',
        isPattern: false,
        type: ''
      },
      {
        id: 'S2_ElectricalGrid',
        isPattern: false,
        type: ''
      },
      {
        id: 'S3_ElectricalGrid',
        isPattern: false,
        type: ''
      }
    ]});
    //this.store.findAll('entity');

    // reschedule refresh
    Ember.run.later(this, function() {
      this.refreshEntities();
    }, ENV.APP.UPDATE_RATE);
  }
});

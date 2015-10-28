import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Route.extend({
  model() {
    return this.store.query('entity', { entities: [
      {
        id: 'S3_ElectricalGrid',
        isPattern: false,
        type: 'ElectricalGridMonitoring'
      },
      {
	id: 'DataFileControl',
	isPattern: false,
	type: 'DataFileControl'
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
        id: 'S3_ElectricalGrid',
        isPattern: false,
        type: 'ElectricalGridMonitoring'
      },
      {
	id: 'DataFileControl',
	isPattern: false,
	type: 'DataFileControl'
      }
    ]});
    //this.store.findAll('entity');

    // reschedule refresh
    Ember.run.later(this, function() {
      this.refreshEntities();
    }, ENV.APP.UPDATE_RATE);
  }
});

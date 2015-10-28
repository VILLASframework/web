import Ember from 'ember';

export default Ember.Controller.extend({
  S1Entity: function() {
    return this.model.findBy('id', 'S1_ElectricalGrid');
  }.property('model.[]'),

  S2Entity: function() {
    return this.model.findBy('id', 'S2_ElectricalGrid');
  }.property('model.[]'),
	
  S1Freq575: function() {
    var entity = this.model.findBy('id', 'S1_ElectricalGrid');
    if (entity) {
      return entity.get('properties').findBy('name', 'Freq_575');
    }
  }.property('model.[]'),

  S2Voltage203937: function() {
    var entity = this.model.findBy('id', 'S2_ElectricalGrid');
    if (entity) {
      return entity.get('properties').findBy('name', 'Voltage203937');
    }
  }.property('model.[]'),

  S2Flow1551412_204871: function() {
    var entity = this.model.findBy('id', 'S2_ElectricalGrid');
    if (entity) {
      return entity.get('properties').findBy('name', 'Flow1551412_204871');
    }
  }.property('model.[]'),

  S3LoadProfile: function() {
    var entity = this.model.findBy('id', 'S3_ElectricalGrid');
    if (entity) {
      return entity.get('properties').findBy('name', 'LoadProfile');
    }
  }.property('model.[]'),

  S3GenProfile: function() {
    var entity = this.model.findBy('id', 'S3_ElectricalGrid');
    if (entity) {
      return entity.get('properties').findBy('name', 'GenProfile');
    }
  }.property('model.[]')
});

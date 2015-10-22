import Ember from 'ember';

export default Ember.Controller.extend({
  state: 1,
  redZone: [{from: 50, to: 60}],
  yellowZone: [{from: 40, to: 50}],

  init: function() {
    this.set('dataSet', this.get('dataSetOne'));
  },

  S1Entity: function() {
    return this.model.findBy('id', 'S1_ElectricalGrid');
  }.property('model.[]'),

	Voltage203937: function() {
		var entity = this.model.findBy('id', 'S1_ElectricalGrid');
		if (entity) {
			return entity.get('properties').findBy('name', 'Voltage203937');
		} else {
			return {};
		}
	}.property('model.[]'),

  Freq575Value: function() {
    var entity = this.model.findBy('id', 'S1_ElectricalGrid');
    if (entity) {
      var attribute = entity.get('properties').findBy('name', 'Freq_575');
      var valuesLength = attribute.get('values').length;
      var tuple = attribute.get('values')[valuesLength - 1];
      return tuple[1];
    } else {
      return {};
    }
  }.property('model.[]'),

  initState: function() {
    return this.get('state') === 1;
  }.property('state'),

  eventState: function() {
    return this.get('state') === 2;
  }.property('state'),

  actions: {
    resetData: function() {
      this.set('state', 1);
      this.set('dataSet', this.get('dataSetOne'));
    },

    eventData: function() {
      this.set('state', 2);
      this.set('dataSet', this.get('dataSetTwo'));
    }
  }
});

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
	}.property('model.[]')
});

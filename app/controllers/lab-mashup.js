import Ember from 'ember';

export default Ember.Controller.extend({
  state: 1,
  freq575GreenZones: [{from: 49.5, to: 50.5}],
  freq575YellowZones: [{from: 47.5, to: 49.5}, {from: 50.5, to: 52.5}],
  freq575RedZones: [{from: 45.0, to: 47.5}, {from: 52.5, to: 55}],

  init: function() {
    this.set('dataSet', this.get('dataSetOne'));

    this._updateButtons();
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

  _updateButtons: function() {
    var control = this.store.peekRecord('data-file-control', 'DataFileControl');
    var updated = false;

    if (control.get('Filename') === 'm1_S1_ElectricalGrid_data.txt') {
      if (this.get('state') !== 1) {
      	his.set('state', 1);
    	updated = true;
      }
    } else {
      if (this.get('state') !== 2) {
        this.set('state', 2); 
	updated = true;
      }
    }

    if (control.get('Status') === 'EOF') {
      if (this.get('state') === 1) {
	control.set('ForceReload', true);
      } else {
	control.set('Filename', 'm1_S1_ElectricalGrid_data.txt');
      }

      updated = true;
    }

    if (updated) {
     control.save();
    }
  },

  _updateDataFileControl: function() {
    var control = this.store.peekRecord('data-file-control', 'DataFileControl');

    if (this.get('state') === 1) {
      control.set('Filename', 'm1_S1_ElectricalGrid_data.txt');
    } else {
      control.set('Filename', 'm2_S1_ElectricalGrid_data.txt');
    }

    control.set('ForceReload', true);
    control.save();
  }.observes('state'),

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

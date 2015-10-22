import Ember from 'ember';

export default Ember.Controller.extend({
  freq575GreenZones: [{from: 49.5, to: 50.5}],
  freq575YellowZones: [{from: 49, to: 49.5}, {from: 50.5, to: 51}],

  init: function() {
    this.set('state', 1);

    Ember.run.later(this, this._updateState, 100);
  },

  S1Entity: function() {
    return this.model.findBy('id', 'S1_ElectricalGrid');
  }.property('model.[]'),

  Voltage203937: function() {
    var entity = this.model.findBy('id', 'S1_ElectricalGrid');
    if (entity) {
      return [
	{
	  label: 'Voltage203937',
	  data: entity.get('properties').findBy('name', 'Voltage203937').get('values'),
	  color: "rgb(51, 153, 255)"
	}
      ];
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

  LoadGenProfiles: function() {
    var entity = this.model.findBy('id', 'S1_ElectricalGrid');
    if (entity) {
      console.log(entity.get('properties').findBy('name', 'LoadProfile'));

      return [
	{
	  label: 'Total consumption [MW]',
	  data: entity.get('properties').findBy('name', 'LoadProfile').get('values'),
	  color: "rgb(51, 153, 255)"
	},
	{
	  label: 'Total PV generation [MW]',
	  data: entity.get('properties').findBy('name', 'GenProfile').get('values'),
	  color: "rgb(255, 91, 51)"
	}
      ];
    } else {
      return [];
    }
  }.property('model.[]'),

  initState: function() {
    return this.get('state') === 1;
  }.property('state'),

  eventState: function() {
    return this.get('state') === 2;
  }.property('state'),

  _updateState: function() {
    var control = this.store.peekRecord('data-file-control', 'DataFileControl');
    var updated = false;

    if (control.get('Filename') === '/share/data/m1_S1_ElectricalGrid_data.txt') {
      if (this.get('state') !== 1) {
	this.set('state', 1);
      }
    } else {
      if (this.get('state') !== 2) {
	this.set('state', 2);
      }
    }

    if (control.get('Status') === 'EOF') {
      if (this.get('state') === 1) {
	control.set('ForceReload', true);
      } else {
	control.set('Filename', '/share/data/m1_S1_ElectricalGrid_data.txt');
      }

      updated = true;
    }

    if (updated) {
      console.log("Update data control");
      control.save();
    }
    
    Ember.run.later(this, this._updateState, 100);
  },

  _updateDataFileControl: function(state) {
    var control = this.store.peekRecord('data-file-control', 'DataFileControl');

    if (state === 1) {
      control.set('Filename', '/share/data/m1_S1_ElectricalGrid_data.txt');
    } else {
      control.set('Filename', '/share/data/m2_S1_ElectricalGrid_data.txt');
    }

    console.log("changed data control");
    control.set('ForceReload', true);
    control.save();
  },

  actions: {
    resetData: function() {
      this._updateDataFileControl(1);
    },

    eventData: function() {
      this._updateDataFileControl(2);
    }
  }
});

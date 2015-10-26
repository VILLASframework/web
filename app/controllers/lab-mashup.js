import Ember from 'ember';

export default Ember.Controller.extend({
  freq575GreenZones: [{from: 49.5, to: 50.5}],
  freq575YellowZones: [{from: 49, to: 49.5}, {from: 50.5, to: 51}],
  freq575AlarmZones: [{from: 49, to: 49.5}, {from: 50.5, to: 51}],

  freq575Value: 0,
  voltage203937: [],
  loadGenProfiles: [],
  totalPValue: [],

  _freezeState: false,

  initState: function() {
    return this.get('state') === 1;
  }.property('state'),

  eventState: function() {
    return this.get('state') === 2;
  }.property('state'),

  initButtonState: function() {
    return this.get('state') === 1 || this.get('state') === 0;
  }.property('state'),

  eventButtonState: function() {
    return this.get('state') === 2 || this.get('state') === 0;
  }.property('state'),

  _updateController: function() {
    // update attribute values
    this._updateAttributes();

    // get new data file control state from store
    if (this._freezeState === false) {
      var control = this.store.peekRecord('data-file-control', 'DataFileControl');

      if (control.get('Filename') === '/share/data/m1_S1_ElectricalGrid_data.txt') {
	// state 1
	if (this.get('state') !== 1) {
	  this.set('state', 1);
	}
      } else {
	// state 2
	if (this.get('state') !== 2) {
	  this.set('state', 2);
	}
      }

      if (control.get('Status') === 'EOF' && control.get('ForceReload') === false) {
	if (this.get('state') === 1) {
	  control.set('ForceReload', true);
	} else {
	  control.set('Filename', '/share/data/m1_S1_ElectricalGrid_data.txt');
	  this.set('state', 1);
	}

	control.save();

	Ember.debug('update control: ' + control.get('Filename') + ', ' + control.get('ForceReload'));
      }
    }

    Ember.run.later(this, this._updateController, 100);
  }.on('init'),

  _updateAttributes: function() {
    // check for model and properties
    if (!this.model) {
      Ember.debug('controller model not found');
      return false;
    }

    var entity = this.model.findBy('id', 'S3_ElectricalGrid');
    if (!entity) {
      Ember.debug('controller entity S3 not found');
      return false;
    }

    var properties = entity.get('properties');
    if (!properties) {
      Ember.debug('controller properties not found');
      return false;
    }

    // update attributes
    var attr_freq575 = properties.findBy('name', 'Freq_575');
    if (attr_freq575) { 
      this.set('freq575Value', attr_freq575.get('currentValue'));
    } else {
      Ember.debug('controller freq575 not found');
    }

    var attr_voltage203937 = properties.findBy('name', 'Voltage203937');
    if (attr_voltage203937) {
      this.set('voltage203937', [
	{
	  label: 'RMS voltage [pu]',
	  data: attr_voltage203937.get('values'),
	  color: 'rgb(51, 153, 255)'
	}
      ]);
    } else {
      Ember.debug('controller voltage203937 not found');
    }

    var attr_loadProfile = properties.findBy('name', 'LoadProfile');
    var attr_genProfile = properties.findBy('name', 'GenProfile');

    if (attr_loadProfile && attr_genProfile) {
      this.set('loadGenProfiles', [
	{
	  label: 'Total consumption [MW]',
	  data: attr_loadProfile.get('values'),
	  color: "rgb(51, 153, 255)"
	},
	{
	  label: 'Total PV generation [MW]',
	  data: attr_genProfile.get('values'),
	  color: "rgb(255, 91, 51)"
	}
      ]);
    } else {
      Ember.debug('controller loadGenProfile not found');
    }

    var attr_totalP = properties.findBy('name', 'TotalP_DS');
    if (attr_totalP) {
      this.set('totalPValue', [
	{
	  bars: { show: true },
	  data: [[0, attr_totalP.get('currentValue')]],
	  label: 'Total DS absorb [MW]'
	}
      ]);
    } else {
      Ember.debug('controller totalP not found');
    }

    return true;
  },

  _updateDataFileControl: function(state) {
    var control = this.store.peekRecord('data-file-control', 'DataFileControl');

    if (state === 1) {
      control.set('Filename', '/share/data/m1_S1_ElectricalGrid_data.txt');
      this.set('state', 1);
    } else {
      control.set('Filename', '/share/data/m2_S1_ElectricalGrid_data.txt');
      this.set('state', 2);
    }

    this._freezeState = true;
    Ember.run.later(this, function() {
      this._freezeState = false;
    }, 1000);

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

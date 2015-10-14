import Ember from 'ember';

export default Ember.Controller.extend({
  S1Entity: function() {
    var entity = null;

    this.model.forEach(function (_entity) {
      if (_entity.id === 'S1_ElectricalGrid') {
        entity = _entity;
      }
    });

    return entity;
  }.property('model.[]'),

  S2Entity: function() {
    var entity = null;

    this.model.forEach(function (_entity) {
      if (_entity.id === 'S2_ElectricalGrid') {
        entity = _entity;
      }
    });

    return entity;
  }.property('model.[]'),

  actions: {
    showProperty1Values(property) {
      var id = property.id;

      var prop = null;

      this.get('S1Entity').get('properties').forEach(function (proper) {
        if (proper.id === id) {
          prop = proper;
        }
      });

      this.set('S1Property', prop);
    },
	
	showProperty2Values(property) {
      var id = property.id;

      var prop = null;

      this.get('S2Entity').get('properties').forEach(function (proper) {
        if (proper.id === id) {
          prop = proper;
        }
      });

      this.set('S2Property', prop);
    }
  }
});

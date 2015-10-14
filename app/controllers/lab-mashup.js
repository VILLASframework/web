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
  }.property('model.[]')
});

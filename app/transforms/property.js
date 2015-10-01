import Ember from 'ember';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function(value) {
    return Ember.create({ name: value[0], value: value[1], type: value[2], timestamp: value[3]});
  },

  serialize: function(value) {
    return [value.get('name'), value.get('value'), value.get('type'), value.get('timestamp')];
  }
});

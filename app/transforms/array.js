import Ember from 'ember';
import Transform from 'ember-data/transform';

export default Transform.extend({
  deserialize(serialized) {
    if (Ember.isArray(serialized)) {
      return serialized;
    } else {
      return [];
    }
  },

  serialize(deserialized) {
    if (Ember.isArray(deserialized)) {
      return deserialized;
    } else {
      return [];
    }
  }
});

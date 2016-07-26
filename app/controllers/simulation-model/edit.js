import Ember from 'ember';

export default Ember.Controller.extend({
  sequence: function() {
    return this.get('model.sequence');
  }.property('model.sequence'),

  values: function() {
    return this.get('model.values');
  }.property('model.values.@each'),

  _updateModel: function() {
    if (this.get('model') === null) {
      Ember.run.later(this, function() {
        var simulationData = this.store.peekRecord('simulation-data', 1);
        this.set('model', simulationData);
        this.notifyPropertyChange('model');
      }, 500);
    }
  }.observes('model').on('init')
});

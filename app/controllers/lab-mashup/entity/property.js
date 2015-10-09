import Ember from 'ember';

export default Ember.Controller.extend({
  model(params) {
    Ember.run.later(this, function() {
      this.refresh();
    }, 500);

    var record = this.store.peekRecord('property', params.property_id);
    return record;
  }
});

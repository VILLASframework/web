import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  properties: DS.attr(),

  poll: function() {
    Ember.debug("Poll");

    var _this = this;
    Ember.run.later(function() {
      _this.reload();
      _this.poll();
    }, 500);
  }.observes('didLoad')
});

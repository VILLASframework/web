import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  properties: DS.attr(),

  poll: function() {
      var _this = this;
      Ember.run.later( function() {
        Ember.debug("reload");

        _this.reload();
        _this.poll();
      }, 1000);
   }.on('didLoad')
});

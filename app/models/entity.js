import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  properties: DS.hasMany('property'),

  /*poll: function() {
      var _this = this;
      Ember.run.later( function() {
        _this.reload();
        _this.poll();
      }, 1000);
   }.on('didLoad')*/
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNames: [ 'plot' ],
  editing: false,

  isTable: function() {
    var type = this.get('plot.type');
    return type === 'table';
  }.property('plot.type'),

  isChart: function() {
    var type = this.get('plot.type');
    return type === 'chart';
  }.property('plot.type'),

  isValue: function() {
    var type = this.get('plot.type');
    return type === 'value';
  }.property('plot.type')
});

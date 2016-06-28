import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  attributeBindings: [ 'style' ],

  plot: null,

  style: function() {
    return 'width: ' + this.get('plot.width') + 'px; height: ' + this.get('plot.height') + 'px; border: 1px solid black;';
  }.property('plot'),

  isTable: function() {
    var type = this.get('plot.type');
    return type === 'table';
  }.property('plot.type')
});

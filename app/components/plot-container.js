import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  attributeBindings: [ 'style' ],

  plot: null,

  style: function() {
    return 'width: ' + this.get('plot.width') + 'px; height: ' + this.get('plot.height') + 'px; border: 1px solid black;';
  }.property('plot'),

  isTable: function() {
    var modelName = this.get('plot.constructor.modelName');
    return modelName === 'plot-table';
  }.property('plot.type')
});

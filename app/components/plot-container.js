import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  attributeBindings: [ 'style' ],
  classNames: [ 'plotContainer' ],

  plot: null,
  editing: false,

  style: function() {
    return 'width: ' + this.get('plot.width') + 'px; height: ' + this.get('plot.height') + 'px;';
  }.property('plot'),

  isTable: function() {
    var type = this.get('plot.type');
    return type === 'table';
  }.property('plot.type')
});

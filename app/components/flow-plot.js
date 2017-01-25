import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: [ 'flow-plot' ],
  attributeBindings: [ 'style' ],

  plot: null,
  data: [],
  options: {},
  height: '85%',

  setupPlot: Ember.on('didInsertElement', function() {
    var plot = Ember.$.plot('#' + this.get('element').id, this.get('data'), this.get('options'));
    this.set('plot', plot);
  }),

  updateData: Ember.observer('data.@each', function() {
    // update plot
    var plot = Ember.$.plot('#' + this.get('element').id, this.get('data'), this.get('options'));
    this.set('plot', plot);
  }),

  style: Ember.computed('height', function() {
    return Ember.String.htmlSafe("height: " + this.get('height') + ";");
  })
});

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['line-chart'],

  init: function() {
    this._super();
    this.addObserver('data', this.dataDidChange);
  },

  didInsertElement: function() {
    this._drawPlot();
  },

  dataDidChange: function() {
    this._drawPlot();
  },

  _drawPlot: function() {
    var elementId = this.get('elementId');
    $.plot('#' + elementId, this.data);
  }
});

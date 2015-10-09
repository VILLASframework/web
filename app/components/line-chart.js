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

    Ember.run.later(this, function() {
      this._drawPlot();
    }, 500);
  },

  dataDidChange: function() {
    this._drawPlot();
  },

  _drawPlot: function() {
    var elementId = this.get('elementId');
    if (elementId) {
      $.plot('#' + elementId, this.data);
    }

    Ember.run.later(this, function() {
      this._drawPlot();
    }, 500);
  }
});

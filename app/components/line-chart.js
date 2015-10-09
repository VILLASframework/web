import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['line-chart'],
  xaxisLength: 100,

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
    var element = this.get('element');
    if (element && element.id) {
      // calculate displayed xaxis
      var length = this.data[0].length;
      var startIndex = 0;
      var endIndex = this.xaxisLength;

      if (length > this.xaxisLength) {
        startIndex = length - this.xaxisLength;
        endIndex = length;
      }

      // display the chart
      $.plot('#' + element.id, this.data, {
        xaxis: {
					min: startIndex,
          max: endIndex
				},
      });

      Ember.run.later(this, function() {
        this._drawPlot();
      }, 500);
    }
  }
});

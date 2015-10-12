import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['line-chart'],
  xaxisLength: 60,

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
    if (this.data) {
      var element = this.get('element');
      if (element && element.id) {
        // calculate displayed xaxis
        /*var length = this.data.length;
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
        });*/

        var firstTimestamp = this.data[0][0];
        var lastTimestamp = this.data[this.data.length - 1][0];

        var diff = lastTimestamp - firstTimestamp;
        var diffValue = this.xaxisLength * 100;

        if (diff > diffValue) {
          firstTimestamp = lastTimestamp - diffValue;
        } else {
          lastTimestamp = +firstTimestamp + +diffValue;
        }

        $.plot('#' + element.id, [this.data], {
          xaxis: {
            mode: 'time',
            timeformat: '%M:%S',
            min: firstTimestamp,
            max: lastTimestamp
          }
        });

        Ember.run.later(this, function() {
          this._drawPlot();
        }, 500);
      }
    }
  }
});

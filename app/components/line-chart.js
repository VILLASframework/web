import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['line-chart'],
  xaxisLength: 60,
  updateTime: 100,

  init: function() {
    this._super();
    this.addObserver('data', this.dataDidChange);
  },

  didInsertElement: function() {
    this._drawPlot();

    Ember.run.later(this, function() {
      this._drawPlot();
    }, this.updateTime);
  },

  dataDidChange: function() {
    this._drawPlot();
  },

  _drawPlot: function() {
    var element = this.get('element');
    if (element && element.id) {
      if (this.data && this.data.length > 0) {
        var firstTimestamp = this.data[0][0];
        var lastTimestamp = this.data[this.data.length - 1][0];

        var diff = lastTimestamp - firstTimestamp;
        var diffValue = this.xaxisLength * 1000;

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
      } else {
        // display empty chart
        $.plot('#' + element.id, [[]], {
          xaxis: {
            show: false
          },
          yaxis: {
            show: false
          }
        });
      }
    }

    // try again
    Ember.run.later(this, function() {
      this._drawPlot();
    }, this.updateTime);
  }
});

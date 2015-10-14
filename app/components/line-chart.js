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
      if (this.data) {
			  var values = this.data.get('values');
			  
			  if (values.length > 0) {
				  // get first and last time stamp for plot
					var firstTimestamp = values[0][0];
			  	var lastTimestamp = values[values.length - 1][0];
	
					var diff = lastTimestamp - firstTimestamp;
					var diffValue = this.xaxisLength * 1000;
					
					if (diff > diffValue) {
					  firstTimestamp = lastTimestamp - diffValue;
					} else {
					  lastTimestamp = +firstTimestamp + +diffValue;
					}
					
					// generate plot options
					var options = {
						series: {
							lines: {
								show: true,
								lineWidth: 1
							},
							shadowSize: 0
						},
						xaxis: {
				    	mode: 'time',
				    	timeformat: '%M:%S',
				    	min: firstTimestamp,
				    	max: lastTimestamp
						},
						yaxis: {
							
						}
					}
					
					// set y axis scale
					if (this.data.get('minValue')) {
						options.yaxis.min = this.data.get('minValue');
					}
					
					if (this.data.get('maxValue')) {
						options.yaxis.max = this.data.get('maxValue');
					}
					
					// draw plot
					$.plot('#' + element.id, [
						{
							data: values,
							color: "rgb(51, 153, 255)"
						}
						], options);
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
    }

    // try again
    Ember.run.later(this, function() {
      this._drawPlot();
    }, this.updateTime);
  }
});

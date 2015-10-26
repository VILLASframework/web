import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['line-chart'],
  attributeBindings: ['style'],
  
  xaxisLength: 300,
  minValue: '',
  maxValue: '',
  label: '',
  height: '100%',
  useLabel: true,

  init: function() {
    this._super();
  },

  didInsertElement: function() {
    this._drawPlot();
  },

  style: function() {
    return "height: " + this.get('height') + ";";
  }.property('height'),

  _drawPlot: function() {
    var element = this.get('element');
    if (element && element.id) {
      if (this.data && this.data.length > 0) {
	var values = this.data[0].data;

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
		lineWidth: 2
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
	      tickDecimals: 2
	    }
	  };
	  		
	  // set y axis scale
	  if (this.data.get('minValue')) {
	    options.yaxis.min = this.data.get('minValue');
	  } else if (this.get('minValue') !== '') {
	    options.yaxis.min = this.get('minValue');
	  }
			
	  if (this.data.get('maxValue')) {
	    options.yaxis.max = this.data.get('maxValue');
	  } else if (this.get('maxValue') !== '') {
	    options.yaxis.max = this.get('maxValue');
	  }

	  // setup plot data
	  var plotData = {
	    data: values,
	    color: "rgb(51, 153, 255)"
	  };
					
	  if (this.get('useLabel')) {
	    if (this.get('label') !== '') {
	      plotData.label = this.get('label');
	    } else {
	      plotData.label = this.data.get('name') + " [" + this.data.get('type') + "]";
	    }
	  }

	  // draw plot
	  $.plot('#' + element.id, this.data, options);
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
  }.observes('data')
});

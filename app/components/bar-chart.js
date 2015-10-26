import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['bar-chart'],
  attributeBindings: ['style'],
  minValue: '',
  maxValue: '',
  width: 150,
  height: 300,
  
  didInsertElement: function() {
    this._drawChart();
  },

  style: function() {
    return 'width: ' + this.get('width') + '; height: ' + this.get('height') + ';';
  }.property('width', 'height'),

  _drawChart: function() {
    // get element 
    var element = this.get('element');
    if (element && element.id) {
      if (this.data) {
	// chart options
	var options = { xaxis: {} };

	if (this.get('minValue') !== '') {
	  options.yaxis.min = this.get('minValue');
	}

	if (this.get('maxValue') !== '') {
	  options.yaxis.max = this.get('maxValue');
	}

	// draw chart
	$.plot('#' + element.id, this.data, options);
      } else {
	// draw empty chart
	$.plot('#' + element.id, [[]], { xaxis: { show: false }, yaxis: { show: false }});
      }
    }
  }.observes('data')
});

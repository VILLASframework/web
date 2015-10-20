import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
  classNames: ['line-chart'],
	attributeBindings: ['style'],
  xaxisLength: 300,
	height: '100%',
	data: [],
	options: {},

  didInsertElement: function() {
    this._drawPlot();
  },

	style: function() {
		return "height: " + this.get('height') + ";";
	}.property('height'),

	_drawPlot: function() {
    var element = this.get('element');
    if (element && element.id) {
			// draw plot
			$.plot('#' + element.id, this.get('data'), this.get('options'));
    }
	}.observes('data')
});

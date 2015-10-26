import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['alarm'],

  size: 40,
  value: 0,
  alarmZones: [],

  _blinking: false,
  _blinkState: false,
  
  didInsertElement: function() {
    this._drawAlarm();
  },

  _drawAlarm: function() {
    // calculate dimensions
    var cx = this.size / 2;
    var radius = this.size / 2 * 0.97;

    // create body element
    var body = d3.select('#' + this.elementId).append("svg:svg").attr("width", this.size).attr("height", this.size);
    this.set('svgBody', body);

    // add background
    body.append("svg:circle")
      .attr("cx", cx)
      .attr("cy", cx)
      .attr("r", radius)
      .style("fill", "#ccc")
      .style("stroke", "#000")
      .style("stroke-width", "0.5px");

    this._redraw();
  },

  _redraw: function() {
    var cx = this.size / 2;
    var radius = this.size / 2 * 0.97;
    var litAlarm = this._shouldLitAlarm();

    if (litAlarm && this._blinking === false) {
      // start blinking
      this._blinkState = true;
      this._blinking = true;
    } else if (litAlarm && this._blinking === true) {
      // switch blink state
      this._blinkState = !this._blinkState;
    } else if (litAlarm === false && this._blinking === true) {
      // stop blinking
      this._blinking = false;
    }

    if (litAlarm && (this._blinking === true && this._blinkState === true)) {
      this.svgBody.append("svg:circle")
	.attr("cx", cx)
	.attr("cy", cx)
	.attr("r", radius * 0.8)
	.style("fill", "#F00")
	.style("stroke", "#000")
	.style("stroke-width", "0.5px");
    } else {
      this.svgBody.append("svg:circle")
	.attr("cx", cx)
	.attr("cy", cx)
	.attr("r", radius * 0.8)
	.style("fill", "#633")
	.style("stroke", "#000")
	.style("stroke-width", "0.5px");
    }

    if (this._blinking === true) {
      Ember.run.later(this, this._redraw, 500);
    }
  }.observes('value'),

  _shouldLitAlarm: function() {
    for (var zone in this.alarmZones) {
      // get border for zone
      var from = this.alarmZones[zone].from;
      var to = this.alarmZones[zone].to;

      if (this.value >= from && this.value <= to) {
	return true;
      }
    }

    return false;
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['gauge'],

  size: 120,
  minValue: 0,
  maxValue: 100,
  value: 0,
  minorTicks: 2,
  majorTicks: 5,
  label: '',
  greenColor: '#109618',
  yellowColor: '#FF9900',
  redColor: '#DC3912',
  greenZones: [],
  yellowZones: [],
  redZones: [],

  didInsertElement: function() {
    this._drawGauge();
  },

  _drawGauge: function() {
    // calculate dimensions
    var cx = this.size / 2;
    var radius = this.size / 2 * 0.97;
    var labelFontSize = Math.round(this.size / 9);
    var fontSize = Math.round(this.size / 16);
    var range = this.maxValue - this.minValue;
    var majorDelta = range / (this.majorTicks - 1);
    var minorDelta = majorDelta / this.minorTicks;
    var midValue = (this.minValue + this.maxValue) / 2;
    var pointerFontSize = Math.round(this.size / 10);

    // create body element
    var body = d3.select('#' + this.elementId).append("svg:svg");
    this.set('svgBody', body);

    // base circles
    body.append("svg:circle")
      .attr("cx", cx)
      .attr("cy", cx)
      .attr("r", radius)
      .style("fill", "#ccc")
      .style("stroke", "#000")
      .style("stroke-width", "0.5px");

    body.append("svg:circle")
      .attr("cx", cx)
      .attr("cy", cx)
      .attr("r", radius * 0.9)
      .style("fill", "#fff")
      .style("stroke", "#e0e0e0")
      .style("stroke-width", "2px");

    // color zones
    for (var index in this.greenZones) {
      this.drawBand(this.greenZones[index].from, this.greenZones[index].to, this.greenColor);
    }

    for (var index in this.yellowZones) {
      this.drawBand(this.yellowZones[index].from, this.yellowZones[index].to, this.yellowColor);
    }

    for (var index in this.redZones) {
      var zone = this.redZones[index];
      this.drawBand(this.redZones[index].from, this.redZones[index].to, this.redColor);
    }

    // label
    if (this.label) {
      body.append("svg:text")
	.attr("x", cx)
	.attr("y", cx / 2 + labelFontSize / 2)
	.attr("dy", labelFontSize / 2)
	.attr("text-anchor", "middle")
	.text(this.label)
	.style("font-size", labelFontSize + "px")
	.style("fill", "#333")
	.style("stroke-width", "0px");
    }

    // ticks
    for (var major = this.minValue; major <= this.maxValue; major += majorDelta) {
      for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.maxValue); minor += minorDelta) {
	var p1 = this.valueToPoint(minor, 0.75);
	var p2 = this.valueToPoint(minor, 0.85);

	body.append("svg:line")
	  .attr("x1", p1.x)
	  .attr("y1", p1.y)
	  .attr("x2", p2.x)
	  .attr("y2", p2.y)
	  .style("stroke", "#666")
	  .style("stroke-width", "1px");
      }

      var p1 = this.valueToPoint(major, 0.7);
      var p2 = this.valueToPoint(major, 0.85);

      body.append("svg:line")
	.attr("x1", p1.x)
	.attr("y1", p1.y)
	.attr("x2", p2.x)
	.attr("y2", p2.y)
	.style("stroke", "#333")
	.style("stroke-width", "2px");

      if (major == this.minValue || major == this.maxValue) {
	var point = this.valueToPoint(major, 0.63);

	body.append("svg:text")
	  .attr("x", point.x)
	  .attr("y", point.y)
	  .attr("dy", fontSize / 3)
	  .attr("text-anchor", major == this.minValue ? "start" : "end")
	  .text(major)
	  .style("font-size", fontSize + "px")
	  .style("fill", "#333")
	  .style("stroke-width", "0px");
      }
    }

    // pointer
    var pointerContainer = body.append("svg:g").attr("class", "pointerContainer");
    var pointerPath = this.buildPointerPath(midValue);
    var pointerLine = d3.svg.line()
      .x(function(d) { return d.x })
      .y(function(d) { return d.y })
      .interpolate("basis");

    pointerContainer.selectAll("path")
      .data([pointerPath])
      .enter()
	.append("svg:path")
	  .attr("d", pointerLine)
	  .style("fill", "#dc3912")
	  .style("stroke", "#c63310")
	  .style("fill-opacity", 0.7);
    
    pointerContainer.append("svg:circle")
      .attr("cx", cx)
      .attr("cy", cx)
      .attr("r", radius * 0.12)
      .style("fill", "#4684EE")
      .style("stroke", "#666")
      .style("opacity", 1);

    pointerContainer.selectAll("text")
      .data([midValue])
      .enter()
	.append("svg:text")
	  .attr("x", cx)
	  .attr("y", this.size - cx / 4 - pointerFontSize)
	  .attr("dy", pointerFontSize / 2)
	  .attr("text-anchor", "middle")
	  .style("font-size", pointerFontSize + "px")
	  .style("fill", "#000")
	  .style("stroke-width", "0px");

    this._redraw(this.value, 0);
  },

  _redraw: function(value, transitionDuration) {
    var pointerContainer = this.svgBody.select(".pointerContainer");
    pointerContainer.selectAll("text").text(Math.round(value));

    var pointer = pointerContainer.selectAll("path");
    var _this = this;

    pointer.transition()
      .duration(transitionDuration)
      .attrTween("transform", function() {
	var pointerValue = value;
	if (value > _this.maxValue) {
	  pointerValue = _this.maxValue + 0.02 * (_this.maxValue - _this.minValue);
	} else if (value < _this.minValue) {
	  pointerValue = _this.minValue - 0.02 * (_this.maxValue - _this.minValue);
	}

	var targetRotation = _this.valueToDegrees(pointerValue) - 90;
	var currentRotation = _this._currentRotation || targetRotation;
	_this._currentRotation = targetRotation;

	return function(step) {
	  var rotation = currentRotation + (targetRotation - currentRotation) * step;
	  return "translate(" + (_this.size / 2) + ", " + (_this.size / 2) + ") rotate(" + rotation + ")";
	}
      });
  }.observes('value'),

  drawBand: function(start, end, color) {
    if (0 >= end - start) {
      return;
    }

    var _this = this;

    this.svgBody.append("svg:path")
      .style("fill", color)
      .attr("d", d3.svg.arc()
	.startAngle(this.valueToRadians(start))
	.endAngle(this.valueToRadians(end))
	.innerRadius(0.65 * (this.size / 2 * 0.97))
	.outerRadius(0.85 * (this.size / 2 * 0.97)))
      .attr("transform", function() {
	return "translate(" + (_this.size / 2) + ", " + (_this.size / 2) + ") rotate(270)";
    });
  },

  buildPointerPath: function(value) {
    var delta = (this.maxValue - this.minValue) / 13;
    var head = this.valueToPoint(value, 0.85);
    var head1 = this.valueToPoint(value - delta, 0.12);
    var head2 = this.valueToPoint(value + delta, 0.12);

    var cx = this.size / 2;
    head.x -= cx;
    head.y -= cx;
    head1.x -= cx;
    head1.y -= cx;
    head2.x -= cx;
    head2.y -= cx;
    
    var tailValue = value - ((this.maxValue - this.minValue) * (1/(270/360)) / 2);
    var tail = this.valueToPoint(tailValue, 0.28);
    var tail1 = this.valueToPoint(tailValue - delta, 0.12);
    var tail2 = this.valueToPoint(tailValue + delta, 0.12);

    tail.x -= cx;
    tail.y -= cx;
    tail1.x -= cx;
    tail1.y -= cx;
    tail2.x -= cx;
    tail2.y -= cx;

    return [head, head1, tail2, tail, tail1, head2, head];
  },

  valueToPoint: function(value, factor) {
    return {
      x: (this.size / 2) - (this.size / 2 * 0.97) * factor * Math.cos(this.valueToRadians(value)),
      y: (this.size / 2) - (this.size / 2 * 0.97) * factor * Math.sin(this.valueToRadians(value))
    };
  },

  valueToRadians: function(value) {
    return this.valueToDegrees(value) * Math.PI / 180;
  },

  valueToDegrees: function(value) {
    return value / (this.maxValue - this.minValue) * 270 - (this.minValue / (this.maxValue - this.minValue) * 270 + 45);
  }
});

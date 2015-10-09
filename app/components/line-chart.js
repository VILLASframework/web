import Ember from 'ember';

const { Component, computed } = Ember;

export default Ember.Component.extend({
  tagName: 'canvas',
  classNames: ['line-chart'],

  didInsertElement: function() {
    // create chart
    var element = this.get('element');
    this.chart = new Chart(element.getContext('2d'));
    this.chart.Line(this.chartData, {

    });
  }
});

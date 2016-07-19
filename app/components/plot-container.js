import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: [ 'plots' ],
  attributeBindings: [ 'style' ],
  editing: false,

  plots: null,

  style: function() {
    return Ember.String.htmlSafe('height: ' + this._calculateHeight() + 'px;');
  }.property('plots.@each.height', 'plots.@each.y'),

  _calculateHeight() {
    var maxHeight = 0;
    var plots = this.get('plots');

    plots.forEach(function(plot) {
      var plotHeight = plot.get('y') + plot.get('height');
      if (plotHeight > maxHeight) {
        maxHeight = plotHeight;
      }
    });

    return maxHeight;
  }
});

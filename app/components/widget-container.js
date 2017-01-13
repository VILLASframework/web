/**
 * File: widget-container.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: [ 'widgets' ],
  attributeBindings: [ 'style' ],

  widgets: null,
  editing: false,
  grid: false,
  data: null,

  style: Ember.computed('widgets.@each.height', 'widgets.@each.y', function() {
    var height = this._calculateHeight();
    if (this.get('editing') === true && height < 400) {
      height = 400;
    }

    return Ember.String.htmlSafe('height: ' + height + 'px;');
  }),

  _calculateHeight() {
    var maxHeight = 0;
    var widgets = this.get('widgets');

    widgets.forEach(function(widget) {
      var widgetHeight = widget.get('y') + widget.get('height');
      if (widgetHeight > maxHeight) {
        maxHeight = widgetHeight;
      }
    });

    // add padding to height
    maxHeight += 40;

    return maxHeight;
  },

  actions: {
    showWidgetDialog(widget) {
      this.sendAction('showWidgetDialog', widget);
    }
  }
});

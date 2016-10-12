/**
 * File: plot-abstract.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import Resizable from '../mixins/resizable';
import Draggable from '../mixins/draggable';

export default Ember.Component.extend(Resizable, Draggable, {
  tagName: 'div',
  classNames: [ 'plotAbstract' ],
  attributeBindings: [ 'style' ],

  plot: null,
  editing: false,
  grid: false,
  data: null,

  simulator: 0,

  disabled_resize: false,
  autoHide_resize: false,
  grid_resize: [ 10, 10 ],

  disabled_drag: false,
  containment_drag: 'parent',
  grid_drag: [ 10, 10 ],
  scroll_drag: true,

  _popoverDisplayed: false,

  didInsertElement() {
    this._super();

    if (this.get('editing') === true) {
      // create popover
      var self = this;

      this.$().popover({
        html: true,
        placement: 'auto right',
        content: function () {
          return self.$('.popover-content').html();
        },
        viewport: { selector: '.plots', padding: 10 }
      });

      // register popover events
      this.$().on('show.bs.popover', function() {

      });

      this.$().on('shown.bs.popover', function() {
        self._popoverDisplayed = true;
      });

      this.$().on('hide.bs.popover', function() {
        self._popoverDisplayed = false;
      });
    }
  },

  style: function() {
    return Ember.String.htmlSafe('width: ' + this.get('plot.width') + 'px; height: ' + this.get('plot.height') + 'px; left: ' + this.get('plot.x') + 'px; top: ' + this.get('plot.y') + 'px;');
  }.property('plot'),

  stop_resize(event, ui) {
    var width = ui.size.width;
    var height = ui.size.height;

    this.set('plot.width', width);
    this.set('plot.height', height);
  },

  resize_resize(event, ui) {
    if (this._popoverDisplayed === true) {
      this.$().popover('show');
    }
  },

  stop_drag(event, ui) {
    this.set('plot.x', ui.position.left);
    this.set('plot.y', ui.position.top);
  },

  drag_drag(event, ui) {
    if (this._popoverDisplayed === true) {
      this.$().popover('show');
    }
  },

  _updateUI: function() {
    if (this.get('editing') === true) {
      this.set('disabled_resize', false);
      this.set('autoHide_resize', false);
      this.set('disabled_drag', false);
    } else {
      this.set('disabled_resize', true);
      this.set('autoHide_resize', true);
      this.set('disabled_drag', true);
    }

    if (this.get('grid') === true) {
      this.set('grid_resize', [ 10, 10 ]);
      this.set('grid_drag', [ 10, 10 ]);
    } else {
      this.set('grid_resize', false);
      this.set('grid_drag', false);
    }
  }.observes('editing', 'grid').on('init'),

  actions: {
    savePlot() {
      this.$().popover('hide');
    }
  }
});

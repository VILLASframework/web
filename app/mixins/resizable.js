/**
 * File: resizable.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 12.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Mixin.create({
  uiResizeOptions: [ 'disabled_resize', 'alsoResize_resize', 'animate_resize',
    'animateDuration_resize', 'animateEasing_resize', 'aspectRatio_resize',
    'autoHide_resize', 'cancel_resize', 'containment_resize', 'delay_resize',
    'distance_resize', 'ghost_resize', 'grid_resize', 'handles_resize', 'helper_resize',
    'maxHeight_resize', 'maxWidth_resize', 'minHeight_resize', 'minWidth_resize' ],
  uiResizeEvents: [ 'create_resize', 'start_resize', 'resize_resize', 'stop_resize' ],

  didInsertElement() {
    this._super.init();

    // get available options and events
    var options = this._gatherResizeOptions();
    this._gatherResizeEvents(options);

    // create a new jQuery UI widget
    var ui = Ember.$.ui['resizable'](options, this.get('element'));
    this.set('ui', ui);
  },

  willDestroyElement() {
    var ui = this.get('ui');

    if (ui) {
      // remove all observers for jQuery UI widget
      var observers = this._observers;
      for (var prop in observers) {
        if (observers.hasOwnProperty(prop)) {
          this.removeObserver(prop, observers[prop]);
        }
      }

      ui.destroy();
    }
  },

  _gatherResizeOptions() {
    // parse all options and add observers for them
    var uiResizeOptions = this.get('uiResizeOptions') || [];
    var options = {};

    uiResizeOptions.forEach(function(key) {
      // save the resize option without the postfix
      options[key.split('_')[0]] = this.get(key);

      // create an observer for this option
      var observer = function() {
        var value = this.get(key);
        //console.log(key + ': ' + value);
        this.get('ui').option(key.split('_')[0], value);
      };

      this.addObserver(key, observer);

      // save observer to remove it later on
      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);

    return options;
  },

  _gatherResizeEvents(options) {
    // register callbacks for each event
    var uiResizeEvents = this.get('uiResizeEvents') || [];
    var _this = this;

    uiResizeEvents.forEach(function(event) {
      var callback = _this[event];
      if (callback) {
        options[event.split('_')[0]] = function(event, ui) {
          callback.call(_this, event, ui);
        };
      }
    });
  }
});

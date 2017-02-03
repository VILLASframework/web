/**
 * File: sortable.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';

export default Ember.Mixin.create({
  uiSortOptions: [ 'appendTo_sort', 'axis_sort', 'cancel_sort', 'connectWith_sort',
    'containment_sort', 'cursor_sort', 'cursorAt_sort', 'delay_sort', 'disabled_sort',
    'distance_sort', 'dropOnEmpty_sort', 'forceHelperSize_sort', 'forcePlaceholderSize_sort',
    'grid_sort', 'handle_sort', 'helper_sort', 'items_sort', 'opacity_sort',
    'placeholder_sort', 'revert_sort', 'scroll_sort', 'scrollSensitivity_sort',
    'scrollSpeed_sort', 'tolerance_sort', 'zIndex_sort' ],
  uiSortEvents: [ 'activate_sort', 'beforeStop_sort', 'change_sort', 'create_sort',
    'deactivate_sort', 'out_sort', 'over_sort', 'receive_sort', 'remove_sort',
    'sort_sort', 'start_sort', 'stop_sort', 'update_sort' ],

  didInsertElement() {
    this._super.init();

    // get available options and events
    var options = this._gatherSortOptions();
    this._gatherSortEvents(options);

    // create a new jQuery UI widget
    var ui = Ember.$.ui['sortable'](options, this.get('element'));
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

  _gatherSortOptions() {
    // parse all options and add observers for them
    var uiSortOptions = this.get('uiSortOptions') || [];
    var options = {};

    uiSortOptions.forEach(function(key) {
      // save the sort option without the postfix
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

  _gatherSortEvents(options) {
    // register callbacks for each event
    var uiSortEvents = this.get('uiSortEvents') || [];
    var _this = this;

    uiSortEvents.forEach(function(event) {
      var callback = _this[event];
      if (callback) {
        options[event.split('_')[0]] = function(event, ui) {
          callback.call(_this, event, ui);
        };
      }
    });
  }
});

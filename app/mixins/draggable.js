import Ember from 'ember';

export default Ember.Mixin.create({
  uiDragOptions: [ 'disabled_drag', 'addClasses_drag', 'appendTo_drag', 'axis_drag',
    'cancel_drag', 'connectToSortable_drag', 'containment_drag', 'cursor_drag',
    'delay_drag', 'distance_drag', 'grid_drag', 'handle_drag','helper_drag',
    'iframeFix_drag','opacity_drag','scope_drag', 'snap_drag', 'snapMode_drag', 'stack_drag' ],
  uiDragEvents: [ 'create_drag', 'start_drag', 'drag_drag', 'stop_drag' ],

  didInsertElement() {
    this._super();

    // get available options and events
    var options = this._gatherDragOptions();
    this._gatherDragEvents(options);

    // create a new jQuery UI widget
    var ui = Ember.$.ui['draggable'](options, this.get('element'));
    this.set('ui', ui);
  },

  willDestroyElement() {
    var ui = this.get('ui');

    if (ui) {
      // remove all observers for jQuery UI widget
      var observers = this._observers;
      for (var property in observers) {
        this.removeObserver(property, observers[property]);
      }

      ui.destroy();
    }
  },

  _gatherDragOptions() {
    // parse all options and add observers for them
    var uiDragOptions = this.get('uiDragOptions') || [];
    var options = {};

    uiDragOptions.forEach(function(key) {
      // save the drag option without the prefix
      options[key.split('_')[0]] = this.get(key);

      // create an observer for this option
      var observer = function() {
        var value = this.get(key);
        this.get('ui').option(key.split('_')[0], value);
      };

      this.addObserver(key, observer);

      // save observer to remove it later on
      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);

    return options;
  },

  _gatherDragEvents(options) {
    // register callbacks for each event
    var uiDragEvents = this.get('uiDragEvents') || [];
    uiDragEvents.forEach(function(event) {
      var callback = this[event];
      if (callback) {
        options[event.split('_')[0]] = function(event, ui) {
          callback.call(this, event, ui);
        };
      }
    }, this);
  }
});

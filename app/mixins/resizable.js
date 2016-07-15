import Ember from 'ember';

export default Ember.Mixin.create({
  uiResizeOptions: [ 'disable_resize', 'alsoResize_resize', 'animate_resize',
    'animateDuration_resize', 'animateEasing_resize', 'aspectRatio_resize',
    'autoHide_resize', 'cancel_resize', 'containment_resize', 'delay_resize', 
    'distance_resize', 'ghost_resize', 'grid_resize', 'handles_resize', 'helper_resize',
    'maxHeight_resize', 'maxWidth_resize', 'minHeight_resize', 'minWidth_resize' ],
  uiResizeEvents: [ 'create_resize', 'start_resize', 'resize_resize', 'stop_resize' ],

  didInsertElement() {
    this._super();

    var options = this._gatherResizeOptions();

    this._gatherResizeEvents(options);

    var ui = Ember.$.ui['resizable'](options, this.get('element'));

    this.set('ui', ui);
  },

  willDestroyElement() {
    var ui = this.get('ui');

    if (ui) {
      var observers = this._observers;
      for (var prop in observers) {
        if (observers.hasOwnProperty(prop)) {
          this.removeObserver(prop, observers[prop]);
        }
      }

      ui._destroy();
    }
  },

  _gatherResizeOptions() {
    var uiResizeOptions = this.get('uiResizeOptions'), options = {};

    uiResizeOptions.forEach(function(key) {
      options[key.split('_')[0]] = this.get(key);

      var observer = function() {
        var value = this.get(key);
        console.log(key + ': ' + value);
        this.get('ui').option(key.split('_')[0], value);
      };

      this.addObserver(key, observer);

      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);

    return options;
  },

  _gatherResizeEvents(options) {
    var uiResizeEvents = this.get('uiResizeEvents') || [], self = this;
    uiResizeEvents.forEach(function(event) {
      var callback = self[event];

      if (callback) {
        options[event.split('_')[0]] = function(event, ui) {
          callback.call(self, event, ui);
        };
      }
    });
  }
});

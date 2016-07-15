import Ember from 'ember';

export default Ember.Mixin.create({
  uiDropOptions: [ 'accept_drop', 'addClasses_drop', 'disabled_drop', 'greedy_drop',
    'hoverClass_drop', 'scope_drop' ],
  uiDropEvents: [ 'create_drop', 'activate_drop', 'deactivate_drop', 'over_drop',
    'out_drop', 'drop_drop' ],

  didInsertElement() {
    this._super();

    // get available options and events
    var options = this._gatherDropOptions();
    this._gatherDropEvents(options);

    // create a new jQuery UI widget
    var ui = Ember.$.ui['droppable'](options, this.get('element'));
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

  _gatherDropOptions() {
    // parse all options and add observers for them
    var uiDropOptions = this.get('uiDropOptions') || [];
    var options = {};

    uiDropOptions.forEach(function(key) {
      // save the drop option without the postfix
      options[key.split('_')[0]] = this.get(key);

      // create an observer for this option
      var observer = function() {
        var value = this.get(key);
        this.get('ui').option(key.split('_')[0], value);
      };

      this.addObserver(key, observer);

      // save observer to remove it later on
      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);

    return options;
  },

  _gatherDropEvents(options) {
    // register callbacks for each event
    var uiDropEvents = this.get('uiDropEvents') || [];
    uiDropEvents.forEach(function(event) {
      var callback = this[event];
      if (callback) {
        options[event.split('_')[0]] = function(event, ui) {
          callback.call(this, event, ui);
        };
      }
    }, this);
  }
});

import Ember from 'ember';
import Resizable from '../mixins/resizable';

export default Ember.Component.extend(Resizable, {
  attributeBindings: [ 'style' ],

  plot: null,

  disabled_resize: false,
  autoHide_resize: false,

  style: function() {
    return 'width: ' + this.get('plot.width') + 'px; height: ' + this.get('plot.height') + 'px;';
  }.property('plot'),

  stop_resize(event, ui) {
    var width = ui.size.width;
    var height = ui.size.height;

    this.set('plot.width', width);
    this.set('plot.height', height);
  },

  _updateUI: function() {
    if (this.get('editing') === true) {
      this.set('disabled_resize', false);
      this.set('autoHide_resize', false);
    } else {
      this.set('disabled_resize', true);
      this.set('autoHide_resize', true);
    }
  }.observes('editing').on('init')
});

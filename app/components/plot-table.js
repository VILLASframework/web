import Ember from 'ember';
import Resizable from '../mixins/resizable';

export default Ember.Component.extend(Resizable, {
  tagName: 'div',
  attributeBindings: [ 'style' ],
  classNames: [ 'plotContainer', 'plotTable' ],

  plot: null,
  editing: false,

  style: function() {
    return 'width: ' + this.get('plot.width') + 'px; height: ' + this.get('plot.height') + 'px;';
  }.property('plot'),

  stop_resize(event, ui) {
    this.set('plot.width', this.$().width());
    this.set('plot.height', this.$().height());
  }
});

import Ember from 'ember';
import Resizable from '../mixins/resizable';

export default Ember.Component.extend(Resizable, {
  tagName: 'div',
  attributeBindings: [ 'style' ],
  classNames: [ 'plotContainer', 'plotValue' ],

  plot: null,
  editing: false,

  minWidth_resize: 50,
  minHeight_resize: 20,

  style: function() {
    return 'width: ' + this.get('plot.width') + 'px; height: ' + this.get('plot.height') + 'px;';
  }.property('plot'),

  stop_resize(event, ui) {
    this.set('plot.width', this.$().width());
    this.set('plot.height', this.$().height());
  }
});

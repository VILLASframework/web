import Ember from 'ember';
import Sortable from '../mixins/sortable';

var { set } = Ember;

export default Ember.Component.extend(Sortable, {
  tagName: 'div',
  classNames: [ 'draggableDropzone plots' ],
  classNameBindings: [ 'dragClass' ],
  dragClass: 'deactivated',

  placeholder_sort: 'plot-placeholder',

  dragLeave(event) {
    event.preventDefault();
    set(this, 'dragClass', 'deactivated');
  },

  dragOver(event) {
    event.preventDefault();
    set(this, 'dragClass', 'activated');
  },

  drop(event) {
    var data = event.dataTransfer.getData('text/data');
    this.sendAction('dropped', data);

    set(this, 'dragClass', 'deactivated');
  }
});

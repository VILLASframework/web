import Ember from 'ember';

var { set } = Ember;

export default Ember.Component.extend({
  tagName: 'div',
  classNames: [ 'draggableDropzone plots' ],
  classNameBindings: [ 'dragClass' ],
  dragClass: 'deactivated',

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

import Ember from 'ember';

var { get } = Ember;

export default Ember.Component.extend({
  classNames: [ 'draggableItem' ],
  attributeBindings: [ 'draggable' ],
  draggable: 'true',

  dragStart(event) {
    return event.dataTransfer.setData('text/data', get(this, 'content'));
  }
});

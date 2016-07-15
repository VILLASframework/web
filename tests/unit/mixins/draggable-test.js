import Ember from 'ember';
import DraggableMixin from 'villasweb-frontend/mixins/draggable';
import { module, test } from 'qunit';

module('Unit | Mixin | draggable');

// Replace this with your real tests.
test('it works', function(assert) {
  let DraggableObject = Ember.Object.extend(DraggableMixin);
  let subject = DraggableObject.create();
  assert.ok(subject);
});

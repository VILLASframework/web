import Ember from 'ember';
import DroppableMixin from 'villasweb-frontend/mixins/droppable';
import { module, test } from 'qunit';

module('Unit | Mixin | droppable');

// Replace this with your real tests.
test('it works', function(assert) {
  let DroppableObject = Ember.Object.extend(DroppableMixin);
  let subject = DroppableObject.create();
  assert.ok(subject);
});

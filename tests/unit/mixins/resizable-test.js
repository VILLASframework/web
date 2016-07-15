import Ember from 'ember';
import ResizableMixin from 'villasweb-frontend/mixins/resizable';
import { module, test } from 'qunit';

module('Unit | Mixin | resizable');

// Replace this with your real tests.
test('it works', function(assert) {
  let ResizableObject = Ember.Object.extend(ResizableMixin);
  let subject = ResizableObject.create();
  assert.ok(subject);
});

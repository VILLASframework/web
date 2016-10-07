import Ember from 'ember';
import LiveDataMixin from 'villasweb-frontend/mixins/live-data';
import { module, test } from 'qunit';

module('Unit | Mixin | live data');

// Replace this with your real tests.
test('it works', function(assert) {
  let LiveDataObject = Ember.Object.extend(LiveDataMixin);
  let subject = LiveDataObject.create();
  assert.ok(subject);
});

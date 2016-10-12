import Ember from 'ember';
import FetchLiveDataMixin from 'villasweb-frontend/mixins/fetch-live-data';
import { module, test } from 'qunit';

module('Unit | Mixin | fetch live data');

// Replace this with your real tests.
test('it works', function(assert) {
  let FetchLiveDataObject = Ember.Object.extend(FetchLiveDataMixin);
  let subject = FetchLiveDataObject.create();
  assert.ok(subject);
});

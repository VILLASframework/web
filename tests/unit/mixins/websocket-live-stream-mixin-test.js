import Ember from 'ember';
import WebsocketLiveStreamMixinMixin from 'villasweb-frontend/mixins/websocket-live-stream-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | websocket live stream mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let WebsocketLiveStreamMixinObject = Ember.Object.extend(WebsocketLiveStreamMixinMixin);
  let subject = WebsocketLiveStreamMixinObject.create();
  assert.ok(subject);
});

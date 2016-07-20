import { moduleForModel, test } from 'ember-qunit';

moduleForModel('simulation-model', 'Unit | Serializer | simulation-model', {
  // Specify the other units that are required for this test.
  needs: ['serializer:simulation-model']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});

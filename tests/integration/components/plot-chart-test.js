import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('plot-chart', 'Integration | Component | plot chart', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{plot-chart}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#plot-chart}}
      template block text
    {{/plot-chart}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  signal: attr('string'),
  width: attr('number', { defaultValue: 100 }),
  height: attr('number', { defaultValue: 100 }),
  title: attr('string'),
  type: attr('string'),
  x: attr('number', { defaultValue: 0 }),
  y: attr('number', { defaultValue: 0 }),
  visualization: belongsTo('Visualization', { async: true })
});

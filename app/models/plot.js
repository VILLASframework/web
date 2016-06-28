import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  signal: attr('string'),
  width: attr('number', { defaultValue: 100 }),
  height: attr('number', { defaultValue: 100 }),
  title: attr('string'),

  type: 'plot'
});

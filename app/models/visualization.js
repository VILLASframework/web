import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  plots: hasMany('plot', { async: true }),
  project: belongsTo('project', { async: true }),
  rows: attr('number', { defaultValue: 1 })
});
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  signal: attr('string'),
  //position:
  //size:
  title: attr('string')
  //backgroundColor:
});

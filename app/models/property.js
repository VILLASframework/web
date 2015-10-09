import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  value: DS.attr('number'),
  type: DS.attr('string'),
  timestamp: DS.attr('date'),
  history: DS.attr(),
  entity: DS.belongsTo('entity'),
  category: DS.belongsTo('category')
});

import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  type: DS.attr('string'),
  values: DS.attr(),
  timestamp: DS.attr('date'),
  visible: DS.attr('boolean', { defaultValue: false }),
  entity: DS.belongsTo('entity'),
  category: DS.belongsTo('category')
});

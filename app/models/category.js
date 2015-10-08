import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  properties: DS.hasMany('property'),
  entity: DS.belongsTo('entity')
});

import DS from 'ember-data';

export default DS.Model.extend({
  Filename: DS.attr('string'),
  ForceReload: DS.attr('boolean'),
  Status: DS.attr('string')
});

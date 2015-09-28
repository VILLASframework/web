import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	value: DS.attr('number'),
	unit: DS.attr('string')
});

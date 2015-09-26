import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		//return this.store.findAll('property');
		let properties = [
			{
				name: "voltage",
				value: 2.3,
				type: "kV"
			},
			{
				name: "current",
				value: 1.6,
				type: "A"
			}
		];
		
		return properties;
	}
});


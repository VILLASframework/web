import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['layout-page'],
	
	visibleProperty: function() {
		var properties = this.get('entity.properties');
		return properties.objectAt(0);
	}.property('entity'),
	
	entityAvailable: function() {
		var properties = this.get('entity.properties');
		return (properties.get('length') > 0);
	}.property('entity'),
	
	actions: {
		showPropertyValues(_prop) {
			this.set('visibleProperty', _prop);
		}
	}
});

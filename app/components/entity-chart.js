import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['layout-page'],
	currentProperty: null,
	
	visibleProperty: function() {
		var properties = this.get('entity.properties');
		var prop = properties.objectAt(0);
		this.setCurrentProperty(prop);
		return prop;
	}.property('entity'),
	
	entityAvailable: function() {
		if (this.get('entity')) {
			var properties = this.get('entity.properties');
			return (properties.get('length') > 0);
		} else {
			return false;
		}
	}.property('entity'),
	
	setCurrentProperty: function(property) {
		if (this.currentProperty) {
			this.currentProperty.set('visible', false);
		}
		
		this.currentProperty = property;
		this.currentProperty.set('visible', true);
	},
	
	actions: {
		showPropertyValues(_prop) {
			this.set('visibleProperty', _prop);
			this.setCurrentProperty(_prop);
		}
	}
});

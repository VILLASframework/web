import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['layout-page'],
	
	visibleProperty: function() {
		var properties = this.get('entity.properties');
		return properties.objectAt(0);
	}.property('entity'),
	
	entityAvailable: function() {
		if (this.get('entity')) {
			var properties = this.get('entity.properties');
			return (properties.get('length') > 0);
		} else {
			return false;
		}
	}.property('entity'),
	
	actions: {
		showPropertyValues(_prop) {
			this.set('visibleProperty', _prop);
		}
	}
});

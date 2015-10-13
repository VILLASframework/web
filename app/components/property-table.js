import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['data-table'],

  actions: {
    propertyClicked(property) {
      this.sendAction('showProperty', property);
    }
  }
});

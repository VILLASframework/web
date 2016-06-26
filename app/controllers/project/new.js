import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    newProject() {
      // create project from form values
      let properties = this.getProperties('name');
      var project = this.store.createRecord('project', properties);
    }
  }
});

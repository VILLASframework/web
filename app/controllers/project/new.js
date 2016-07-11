import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    newProject() {
      // get current user
      var user = this.get('sessionUser.user');

      // create new project from properties
      var properties = this.getProperties('name');
      properties['owner'] = user;

      var project = this.store.createRecord('project', properties);
      var controller = this;

      project.save().then(function() {
        controller.transitionToRoute('/projects');
      });
    },

    cancelNewProject() {
      this.transitionToRoute('/projects');
    }
  }
});

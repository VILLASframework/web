import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    newProject() {
      // get current user object
      var userId = this.get('sessionUser.user.id');
      var user = this.store.peekRecord('user', userId);

      // create new project from properties
      var properties = this.getProperties('name');
      properties['owner'] = user;

      var project = this.store.createRecord('project', properties);
      var controller = this;

      // save the project and user
      project.save().then(function() {
        // add the project to the user
        user.get('projects').pushObject(project);

        user.save().then(function() {
          controller.transitionToRoute('/projects');
        });
      });
    },

    cancelNewProject() {
      this.transitionToRoute('/projects');
    }
  }
});

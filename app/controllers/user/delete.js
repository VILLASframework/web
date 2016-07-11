import Ember from 'ember';

export default Ember.Controller.extend({
  sessionUser: Ember.inject.service('session-user'),

  actions: {
    cancelDelete() {
      this.transitionToRoute('/user/');
    },

    confirmDelete() {
      // delete all projects
      var user = this.get('model');
      user.destroyRecord();

      this.transitionToRoute('/user/');
    }
  }
});

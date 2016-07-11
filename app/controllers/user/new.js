import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    newUser() {
      // create new user from properties
      var properties = this.getProperties('username', 'password');

      var user = this.store.createRecord('user', properties);
      var controller = this;

      user.save().then(function() {
        controller.transitionToRoute('/user');
      });
    },

    cancelNewUser() {
      this.transitionToRoute('/user');
    }
  }
});

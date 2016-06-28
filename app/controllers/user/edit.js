import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    changeUser() {
      // save the changes
      var user = this.get('model');
      user.save();
    }
  }
});

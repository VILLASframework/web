import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  sessionUser: Ember.inject.service('session-user'),

  model() {
    // get session user
    var userId = this.get('sessionUser.user.id');
    return this.store.findRecord('user', userId);
  }
});

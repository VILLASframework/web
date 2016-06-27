import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  sessionUser: service('session-user'),

  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._loadCurrentUser().then(() => {
      this.transitionTo('/');
    }).catch(() => this.get('session').invalidate());
  },

  _loadCurrentUser() {
    return this.get('sessionUser').loadCurrentUser();
  },

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});

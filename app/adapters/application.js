import RESTAdapter from 'ember-data/adapters/rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

export default RESTAdapter.extend(DataAdapterMixin, {
  host: 'http://' + ENV.APP.API_HOST,
  namespace: 'api/v1',
  authorizer: 'authorizer:custom',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
});

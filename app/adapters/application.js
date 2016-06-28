import RESTAdapter from 'ember-data/adapters/rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default RESTAdapter.extend(DataAdapterMixin, {
  host: 'http://192.168.99.100:3000',
  namespace: 'api/v1',
  authorizer: 'authorizer:custom',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
});

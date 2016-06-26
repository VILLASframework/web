import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  host: 'http://192.168.99.100:3000',
  namespace: 'api/v1',
  authorizer: 'authorizer:custom'
});

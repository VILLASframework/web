import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.APP.API_HOST,
  namespace: 'api/ngsi10',
  headers: {
    Accept: 'application/json'
  },

  findAll: function(store, type, sinceToken) {
    var requestBody = {
      entities: [
        {
          type: 'ElectricalGridMonitoring',
          isPattern: true,
          id: 'S?_ElectricalGrid'
        }
      ]
    };

    return this.ajax(this.host + '/' + this.namespace + '/queryContext', 'POST', { data: requestBody });
  },

  findRecord: function(store, type, id, snapshot) {
    var requestBody = {
      entities: [
        {
          type: 'ElectricalGridMonitoring',
          isPattern: false,
          id: id
        }
      ]
    };

    return this.ajax(this.host + '/' + this.namespace + '/queryContext', 'POST', { data: requestBody });
  },

  query: function(store, type, query) {
    return this.ajax(this.host + '/' + this.namespace + '/queryContext', 'POST', { data: query });
  }
});

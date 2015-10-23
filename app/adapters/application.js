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
        },
	{
	  type: 'DataFileControl',
	  isPattern: false,
	  id: 'DataFileControl'
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
        },
	{
	  type: 'DataFileControl',
	  isPattern: false,
	  id: 'DataFileControl'
	}
      ]
    };

    return this.ajax(this.host + '/' + this.namespace + '/queryContext', 'POST', { data: requestBody });
  },

  query: function(store, type, query) {
    return this.ajax(this.host + '/' + this.namespace + '/queryContext', 'POST', { data: query });
  },

  updateRecord: function(store, type, snapshot) {
    var requestBody = {};

    var serializer = store.serializerFor(type.modelName);

    serializer.serializeIntoHash(requestBody, type, snapshot);
    var url = this.host + '/' + this.namespace + '/updateContext';

    return this.ajax(url, 'POST', { data: requestBody });
  }
});

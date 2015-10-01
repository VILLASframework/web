import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://46.101.131.212:80',
  namespace: 'ngsi10',
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
});

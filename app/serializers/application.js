import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeFindAllResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: [] };

    // check if payload has context responses
    if (payload.contextResponses) {
      payload.contextResponses.forEach(function(item) {
        // check if item has context element
        if (item.contextElement) {
          // create new entity object
          var entity = {
            type: 'entity',
            id: item.contextElement.id,
            attributes: {
              type: item.contextElement.type,
              properties: []
            }
          }

          item.contextElement.attributes.forEach(function(attribute) {
            var property = {
              name: attribute.name,
              value: attribute.value,
              type: attribute.type
            }

            entity.attributes.properties.push(property);
          });

          // add entity to data
          json.data.push(entity);
        }
      });
    }

    console.log(json);

    return json;
  },

  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: {} };

    // check if payload has context responses
    if (payload.contextResponses) {
      payload.contextResponses.forEach(function(item) {
        // check if item has context element
        if (item.contextElement) {
          // create new entity object
          json.data = {
            type: 'entity',
            id: item.contextElement.id,
            attributes: {
              type: item.contextElement.type,
              properties: []
            }
          }

          item.contextElement.attributes.forEach(function(attribute) {
            var property = {
              name: attribute.name,
              value: attribute.value,
              type: attribute.type
            }

            json.data.attributes.properties.push(property);
          });
        }
      });
    }

    console.log(json);

    return json;
  }
});

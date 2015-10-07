import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeFindAllResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: [] };

    this._normalizePayload(payload, function(entity) {
      json.data.push(entity);
      return true;
    });

    return json;
  },

  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: {} };

    this._normalizePayload(payload, function(entity) {
      json.data = entity;
      return false;
    });

    return json;
  },

  _normalizePayload: function(payload, handleEntity) {
    var propertyIndex = 0;

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
              type: item.contextElement.type//,
              //properties: []
            },
            relationships: {
              properties: {
                data: []
              }
            }
          }

          if (item.contextElement.attributes) {
            item.contextElement.attributes.forEach(function(attribute) {
              var property = {
                type: 'property',
                id: 'property_' + propertyIndex++,
                attributes: {
                  name: attribute.name,
                  type: attribute.type,
                  value: attribute.value,
                  timestamp: attribute.metadatas[0].value
                },
                relationships: {
                  entity: {
                    data: { type: 'entity', id: entity.id }
                  }
                }
              }

              entity.relationships.properties.data.push({ type: 'property', id: property.id });

              handleEntity(property);
            });
          }

          // pass entity to caller function
          if (handleEntity(entity) == false) {
            // if false returned the caller needs no more entites
            return;
          }
        }
      });
    }
  }
});

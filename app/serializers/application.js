import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeFindAllResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: [] };

    this._normalizePayload(payload, function(item) {
      if (item.type === 'entity') {
        json.data.push(item);
      } else if (item.type === 'property') {
        // create record if needed, otherwise add to current one
        var record = store.peekRecord('property', item.id);
        if (record) {
          var length = record.get('history')[0].length;
          record.get('history')[0].push([length, record.get('value')]);
          record.set('value', item.attributes.value);
        } else {
          // add new item
          store.push(item);
        }
      }

      return true;
    });

    return json;
  },

  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: {} };

    this._normalizePayload(payload, function(item) {
      //json.data = item;
      //return false;

      if (item.type === 'entity') {
        json.data = item;
      } else if (item.type === 'property') {
        // create record if needed, otherwise add to current one
        var record = store.peekRecord('property', item.id);
        if (record) {
          var length = record.get('history').length;
          record.get('history')[0].push([length, record.get('value')]);
          record.set('value', item.attributes.value);
        } else {
          // add new item
          store.push(item);
        }
      }

      return true;
    });

    return json;
  },

  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: [] };

    this._normalizePayload(payload, function(item) {
      if (item.type === 'entity') {
        json.data.push(item);
      } else if (item.type === 'property') {
        // create record if needed, otherwise add to current one
        var record = store.peekRecord('property', item.id);
        if (record) {
          var length = record.get('history').length;
          record.get('history')[0].push([length, record.get('value')]);
          record.set('value', item.attributes.value);
        } else {
          // add new item
          store.push(item);
        }
      }

      return true;
    });

    return json;
  },

  _normalizePayload: function(payload, handleItem) {
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
              if (attribute.type !== 'category') {
                // create property
                var property = {
                  type: 'property',
                  id: 'property_' + propertyIndex++,
                  attributes: {
                    name: attribute.name,
                    type: attribute.type,
                    value: attribute.value,
                    history: [[[0, attribute.value]]]
                  },
                  relationships: {
                    entity: {
                      data: { type: 'entity', id: entity.id }
                    }
                  }
                }

                // find timestamp
                attribute.metadatas.forEach(function(metadata) {
                  if (metadata.name === 'timestamp') {
                    property.attributes.timestamp = metadata.value;
                  }
                });

                entity.relationships.properties.data.push({ type: 'property', id: property.id });

                handleItem(property);
              } else {
                var category = {
                  type: 'category',
                  id: 'category_' + propertyIndex++,
                  attributes: {
                    name: attribute.name,
                  },
                  relationships: {
                    entity: {
                      data: { type: 'entity', id: entity.id }
                    }
                  }
                }

                handleItem(category);
              }
            });
          }

          // pass entity to caller function
          if (handleItem(entity) == false) {
            // if false returned the caller needs no more entites
            return;
          }
        }
      });
    }
  }
});

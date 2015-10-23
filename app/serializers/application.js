import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeFindAllResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: [] };

    var _this = this;

    this._normalizePayload(payload, function(item) {
      if (item.type === 'entity') {
        json.data.push(item);
      } else if (item.type === 'property') {
        _this._updateProperty(item);
      } else if (item.type === 'data-file-control') {
	_this._updateDataFileControl(item);
      }

      return true;
    });

    return json;
  },

  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: {} };

    var _this = this;

    this._normalizePayload(payload, function(item) {
      if (item.type === 'entity') {
        json.data = item;
      } else if (item.type === 'property') {
        _this._updateProperty(item);
      } else if (item.type === 'data-file-control') {
	_this._updateDataFileControl(item);
      }

      return true;
    });

    return json;
  },

  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    var json = { data: [] };

    var _this = this;

    this._normalizePayload(payload, function(item) {
      if (item.type === 'entity') {
        json.data.push(item);
      } else if (item.type === 'property') {
        _this._updateProperty(item);
      } else if (item.type === 'data-file-control') {
	_this._updateDataFileControl(item);
      }

      return true;
    });

    return json;
  },

  serializeIntoHash: function(hash, typeClass, snapshot, options) {
    hash.contextElements = [
      {
	id: snapshot.id,
	type: 'DataFileControl',
	isPattern: false,
	attributes: []
      }
    ];
    hash.updateAction = "APPEND";

    for (var name in snapshot._attributes) {
      hash.contextElements[0].attributes.push({
	name: name,
	value: snapshot._attributes[name]
      });
    }
  },

  _normalizePayload: function(payload, handleItem) {
    var propertyIndex = 0;

    // check if payload has context responses
    if (payload.contextResponses) {
      payload.contextResponses.forEach(function(item) {
        // check if item has context element
        if (item.contextElement) {
	  if (item.contextElement.type === 'DataFileControl') {
	    var dataFileControl = {
	      type: 'data-file-control',
	      id: item.contextElement.id,
	      attributes: {
	      }
	    };

	    if (item.contextElement.attributes) {
	      item.contextElement.attributes.forEach(function(attribute) {
		if (attribute.name === 'Filename') {
		  dataFileControl.attributes.Filename = attribute.value;
		} else if (attribute.name === 'ForceReload') {
		  dataFileControl.attributes.ForceReload = attribute.value;
		} else if (attribute.name === 'Status') {
		  dataFileControl.attributes.Status = attribute.value;
		}
	      });
	    }

	    handleItem(dataFileControl);
	  } else {
	    // create new entity object
	    var entity = {
	      type: 'entity',
	      id: item.contextElement.id,
	      attributes: {
		type: item.contextElement.type
	      },
	      relationships: {
		properties: {
		  data: []
		}
	      }
	    }

	    if (item.contextElement.attributes) {
	      var timestamp = 0;

	      item.contextElement.attributes.forEach(function(attribute) {
		if (attribute.name === 'timestamp') {
		  timestamp = attribute.value;
		}
	      });

	      item.contextElement.attributes.forEach(function(attribute) {
		if (attribute.name !== 'timestamp') {
		  // find metadata
		  var source = "";
		  var minValue;
		  var maxValue;

		  if (attribute.metadatas) {
		    attribute.metadatas.forEach(function(metadata) {
		      if (metadata.name === 'timestamp') {
			timestamp = Date.parse(metadata.value);
		      } else if (metadata.name === 'source') {
									    source = metadata.value;
		      } else if (metadata.name === 'min') {
									    minValue = metadata.value;
		      } else if (metadata.name === 'max') {
									    maxValue = metadata.value;
		      }
		    });
		  }

		  // create property
		  var property = {
		    type: 'property',
		    id: 'property_' + propertyIndex++,
		    attributes: {
		      name: attribute.name,
		      type: attribute.type,
		      timestamp: timestamp,
		      visible: false,
		      source: source,
		      minValue: minValue,
		      maxValue: maxValue,
		      values: []
		    },
		    relationships: {
		      entity: {
			data: { type: 'entity', id: entity.id }
		      }
		    }
		  }

		  // add values
		  if (attribute.value) {
		    if ($.isArray(attribute.value)) {
		      attribute.value.forEach(function (value) {
						  // fix for second to millisecond
						  value[0] = +value[0] * 1000;
						  
			  property.attributes.values.push(value);
			  property.attributes.currentValue = value[1];
		      });
		    } else {
		      property.attributes.values.push([(new Date()).getTime(), attribute.value]);
		      property.attributes.currentValue = attribute.value;
		    }
		  }

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
        }
      });
    }
  },

  _updateProperty: function(item) {
    // create record if needed, otherwise add to current one
    var record = this.store.peekRecord('property', item.id);
    if (record) {
      if (record.get('timestamp') !== item.attributes.timestamp) {
        item.attributes.values.forEach(function (value) {
          record.get('values').push(value);
        });

        record.set('timestamp', item.attributes.timestamp);
	record.set('currentValue', item.attributes.currentValue);
      }
    } else {
      // add new item
      this.store.push(item);
    }
  },

  _updateDataFileControl: function(item) {
    var record = this.store.peekRecord('data-file-control', item.id);
    if (record) {
      record.set('Filename', item.attributes.Filename);
      record.set('ForceReload', item.attributes.ForceReload);
      record.set('Status', item.attributes.Status);
    } else {
      this.store.push(item);
    }
  }
});

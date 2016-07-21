/**
 * File: simulation-data.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import DS from 'ember-data';

export default DS.Serializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    console.log('normalizeResponse');
    return {};
  },

  serialize(record, options) {
    console.log('serialize');
    return null;
  }
});

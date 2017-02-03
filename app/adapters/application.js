/**
 * File: application.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 26.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import RESTAdapter from 'ember-data/adapters/rest';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

export default RESTAdapter.extend(DataAdapterMixin, {
  host: 'http://' + ENV.APP.API_HOST,
  namespace: 'api/v1',
  authorizer: 'authorizer:custom',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

  urlForQueryRecord(query /*, modelName */) {
    // Fix for /users/me query
    let baseUrl = this.buildURL();
    return baseUrl + '/users/' + query;
  }
});

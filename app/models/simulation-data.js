/**
 * File: simulation-data.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  simulator: Ember.computed.alias('id'),
  sequence: attr('number'),
  timestamp: attr('number'),
  values: attr('array'),

  flotValues: Ember.computed('_flotValues', function() {
    return this._flotValues;
  }),

  _flotValues: [],

  _updateHistories: Ember.observer('values', function() {
    // update flot values
    let values = this.get('values');

    // add empty arrays for each value
    while (this._flotValues.length < values.length) {
      this._flotValues.push([]);
    }

    for (var i = 0; i < values.length; i++) {
      this._flotValues[i].push([this.get('timestamp'), values[i]]);

      // discard old values
      while (this._flotValues[i].length > 100) {
        this._flotValues[i].shift();
      }
    }
  })
});

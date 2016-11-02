/**
 * File: visualization.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  widgets: hasMany('widget', { async: true }),
  project: belongsTo('project', { async: true }),
  rows: attr('number', { defaultValue: 1 })
});

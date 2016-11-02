/**
 * File: widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 28.06.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  widgetData: attr(),
  width: attr('number', { defaultValue: 100 }),
  height: attr('number', { defaultValue: 100 }),
  type: attr('string'),
  x: attr('number', { defaultValue: 0 }),
  y: attr('number', { defaultValue: 0 }),
  visualization: belongsTo('Visualization', { async: true })
});

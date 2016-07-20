/**
 * File: plot-table.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import PlotAbstract from './plot-abstract';

export default PlotAbstract.extend({
  classNames: [ 'plotTable' ],

  minWidth_resize: 200,
  minHeight_resize: 60
});

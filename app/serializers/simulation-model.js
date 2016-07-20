/**
 * File: simulation-model.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 20.07.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    owner: { serialize: 'ids' },
    projects: { serialize: 'ids' }
  }
});

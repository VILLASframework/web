/**
 * File: file-upload.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.12.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  files: null,

  filesDidChange: function(files) {
    this.set('files', files);
  }
});

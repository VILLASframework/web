/**
 * File: widget-label.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 03.11.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import WidgetAbstract from './widget-abstract';

export default WidgetAbstract.extend({
  classNames: [ 'widgetLabel' ],

  minWidth_resize: 50,
  minHeight_resize: 20,

  doubleClick() {
    if (this.get('editing') === true) {
      // prepare modal
      this.set('name', this.get('widget.name'));

      // show modal
      this.set('isShowingModal', true);
    }
  },

  actions: {
    submitModal() {
      // verify properties
      let properties = this.getProperties('name');

      if (properties['name'] === null || properties['name'] === "") {
        this.set('errorMessage', 'Widget name is missing');
        return;
      }

      // save properties
      this.get('widget').setProperties(properties);

      let self = this;

      this.get('widget').save().then(function() {
        self.set('isShowingModal', false);
      });
    },

    cancelModal() {
      this.set('isShowingModal', false);
    }
  }
});

/**
 * File: widget-image.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 05.12.2016
 * Copyright: 2016, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import WidgetAbstract from './widget-abstract';
import Ember from 'ember';
import ENV from '../config/environment';
import EmberUploader from 'ember-uploader';

const {
  inject: { service },
  RSVP
} = Ember;

export default WidgetAbstract.extend({
  classNames: [ 'widgetImage' ],

  session: service('session'),
  sessionUser: Ember.inject.service('session-user'),
  store: service(),

  url: 'http://' + ENV.APP.API_HOST,
  namespace: 'api/v1',

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
      properties.widgetData = { path: this.get('image.path') };

      this.get('widget').setProperties(properties);

      let self = this;

      this.get('widget').save().then(function() {
        self.set('isShowingModal', false);
      });
    },

    cancelModal() {
      this.set('isShowingModal', false);
    },

    selectImage(image) {
      // get image by path
      var self = this;

      this.get('widget.visualization').then((visualization) => {
        visualization.get('project').then((project) => {
          project.get('owner').then((user) => {
            user.get('files').then((files) => {
              files.forEach(function(file) {
                if (file.get('name') === image) {
                  // set image
                  self.set('image', file);
                }
              });
            });
          });
        });
      });
    },

    upload() {
      // check if any files to upload
      let files = this.get('uploadFiles');

      if (!Ember.isEmpty(files)) {
        var uploadURL = this.get('url') + '/' + this.get('namespace') + '/upload';

        const uploader = EmberUploader.Uploader.create({
          multiple: true,
          url: uploadURL,
          ajaxSettings: {
            headers: {
              'x-access-token': this.get('session.data.authenticated.token')
            }
          }
        });

        var self = this;

        uploader.upload(files).then(event => {
          // reload user
          var user = self.get('sessionUser.user');
          self.get('store').findRecord('user', user.get('id'));
        });
      }
    }
  }
});

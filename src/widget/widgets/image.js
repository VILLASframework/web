/**
 * File: image.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 14.03.2017
 *
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import React from 'react';

import AppDispatcher from '../../common/app-dispatcher';
import config from '../../config';

class WidgetImage extends React.Component {

  componentDidMount() {
    // Query the image referenced by the widget
    let widgetFile = this.props.widget.customProperties.file;
    if (widgetFile !== -1 && !this.props.files.find(file => file.id === widgetFile)) {
      AppDispatcher.dispatch({
        type: 'files/start-load',
        data: widgetFile,
        token: this.props.token
      });
    }
  }

  render() {
    const file = this.props.files.find(file => file.id === this.props.widget.customProperties.file);

    return (
      <div className="full">
        {file ? (
          <img className="full" alt={file.name} src={'/' + config.publicPathBase + file.path} onDragStart={e => e.preventDefault()} />
        ) : (
          <img className="full" alt="questionmark" src={'/' + config.publicPathBase + 'missing-image.png'} onDragStart={e => e.preventDefault()} />
        )}
      </div>
    );
  }
}

export default WidgetImage;

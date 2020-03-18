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
    let fileHasData = false;
    let fileData, objectURL;
    if (file){
      fileHasData = file.hasOwnProperty("data");
      if (fileHasData){
        //console.log("File data: ", file.data);

        fileData = new Blob([file.data],  {type: file.type});
        objectURL = window.URL.createObjectURL(fileData);
        console.log("Image created new file", fileData, "and objectID", objectURL)
      }
    }

    console.log("Image: has data:", fileHasData);

    return (
      <div className="full">
        {file ? (
          <img className="full" alt={file.name} src={fileHasData ? objectURL : ''} onDragStart={e => e.preventDefault()} />
        ) : (
          <img className="full" alt="No file selected." />
        )}
      </div>
    );
  }
}

export default WidgetImage;

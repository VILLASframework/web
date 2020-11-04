/**
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

  constructor(props) {
    super(props);

    this.state = {
      file: undefined,
    }
  }

  componentDidMount() {
    // Query the image referenced by the widget
    let widgetFile = this.props.widget.customProperties.file;
    if (widgetFile !== -1 && this.state.file === undefined) {
      AppDispatcher.dispatch({
        type: 'files/start-download',
        data: widgetFile,
        token: this.props.token
      });
    }
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

    if(this.props.widget.customProperties.file === -1){
      this.props.widget.customProperties.update = false;
      if(this.state.file !== undefined) this.setState({ file: undefined })
    }

    let file = this.props.files.find(file => file.id === parseInt(this.props.widget.customProperties.file, 10));

    if (file !== undefined) {
      if (this.props.widget.customProperties.update) {
        this.props.widget.customProperties.update = false;
        AppDispatcher.dispatch({
          type: 'files/start-download',
          data: file.id,
          token: this.props.token
        });
        this.setState({ file: file })
      }
    }

  }

  imageError(e){
    console.error("Image ", this.state.file.name, "cannot be displayed.");
  }

  render() {
    let objectURL=''
    if(this.state.file !== undefined && this.state.file.objectURL !== undefined) {
      objectURL = this.state.file.objectURL
    }

    return (
      <div className="full">
        {objectURL !== '' ? (
          <img onError={(e) => this.imageError(e)} className="full" alt={this.state.file.name} src={objectURL} onDragStart={e => e.preventDefault()} />
        ) : (
          <img className="full" alt="No file selected." />
        )}
      </div>
    );
  }
}

export default WidgetImage;

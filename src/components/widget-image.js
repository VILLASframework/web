/**
 * File: widget-image.js
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

import React, { Component } from 'react';

const API_URL = 'http://localhost:4000/';

class WidgetImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null
    };
  }

  componentWillReceiveProps(nextProps) {
    // check if file is set
    if (nextProps.widget.file == null) {
      this.setState({ file: null });
      return;
    }

    // get file by id
    nextProps.files.forEach(file => {
      if (file._id === nextProps.widget.file) {
        this.setState({ file: file });
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.file &&
          <img alt={this.state.file.name} style={{ width: this.props.widget.width - 20, height: this.props.widget.height - 20 }} src={API_URL + this.state.file.path} />
        }
      </div>
    );
  }
}

export default WidgetImage;

/**
 * File: widget-image.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 14.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

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

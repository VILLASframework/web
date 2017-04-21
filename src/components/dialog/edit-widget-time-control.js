/**
 * File: edit-widget-time-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 13.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

class EditWidgetTimeControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        time: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ widget: nextProps.widget });
  }

  render() {

    return (
      <FormGroup controlId="time">
        <ControlLabel>Time</ControlLabel>
        <FormControl type="number" min="1" max="300" placeholder="Enter time" value={this.state.widget.time} onChange={(e) => this.props.handleChange(e)} />
        <HelpBlock>Time in seconds</HelpBlock>
      </FormGroup>
    );
  }
}

export default EditWidgetTimeControl;

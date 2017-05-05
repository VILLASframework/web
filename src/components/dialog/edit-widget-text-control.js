/**
 * File: edit-widget-text-control.js
 * Author: Ricardo Hernandez-Montoya <rhernandez@gridhound.de>
 * Date: 21.04.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class EditWidgetTextControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {}
    };
  }

  componentWillReceiveProps(nextProps) {
      // Update state's widget with props
    this.setState({ widget: nextProps.widget });
  }

  render() {

    return (
        <FormGroup controlId={ this.props.controlId }>
          <ControlLabel> { this.props.label } </ControlLabel>
          <FormControl type="text" placeholder={ this.props.placeholder } value={ this.state.widget[this.props.controlId] || '' } onChange={(e) => this.props.handleChange(e)} />
          <FormControl.Feedback />
        </FormGroup>
    );
  }
}

export default EditWidgetTextControl;
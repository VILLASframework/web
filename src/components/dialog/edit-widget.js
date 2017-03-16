/**
 * File: edit-widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component, PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import Dialog from './dialog';

import EditValueWidget from './edit-widget-value';
import EditPlotWidget from './edit-widget-plot';
import EditTableWidget from './edit-widget-table';
import EditImageWidget from './edit-widget-image';

class EditWidgetDialog extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  valid: true;

  constructor(props) {
    super(props);

    this.state = {
      widget: {
        name: '',
        simulator: '',
        signal: 0
      }
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state.widget);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e, index) {
    var widget = this.state.widget;
    widget[e.target.id] = e.target.value;
    this.setState({ widget: widget });

    //console.log(this.state.widget);
  }

  resetState() {
    this.setState({ widget: this.props.widget });
  }

  validateForm(target) {
    // check all controls
    var name = true;

    if (this.state.name === '') {
      name = false;
    }

    this.valid = name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
  }

  render() {
    // get widget part
    var widgetDialog = null;

    if (this.props.widget) {
      if (this.props.widget.type === 'Value') {
        widgetDialog = <EditValueWidget widget={this.state.widget} validate={(id) => this.validateForm(id)} simulation={this.props.simulation} handleChange={(e) => this.handleChange(e)} />;
      } else if (this.props.widget.type === 'Plot') {
        widgetDialog = <EditPlotWidget widget={this.state.widget} validate={(id) => this.validateForm(id)} simulation={this.props.simulation} handleChange={(e, index) => this.handleChange(e, index)} />;
      } else if (this.props.widget.type === 'Table') {
        widgetDialog = <EditTableWidget widget={this.state.widget} validate={(id) => this.validateForm(id)} simulation={this.props.simulation} handleChange={(e, index) => this.handleChange(e, index)} />;
      } else if (this.props.widget.type === 'Image') {
        widgetDialog = <EditImageWidget widget={this.state.widget} files={this.props.files} validate={(id) => this.validateForm(id)} simulation={this.props.simulation} handleChange={(e, index) => this.handleChange(e, index)} />;
      }
    }

    return (
      <Dialog show={this.props.show} title="Edit Widget" buttonTitle="save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form encType='multipart/form-data'>
          <FormGroup controlId="name" validationState={this.validateForm('name')}>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="text" placeholder="Enter name" value={this.state.widget.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>

          {widgetDialog}
        </form>
      </Dialog>
    );
  }
}

export default EditWidgetDialog;
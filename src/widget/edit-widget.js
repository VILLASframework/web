/**
 * File: edit-widget.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 08.03.2017
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
//import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

import Dialog from '../common/dialogs/dialog';

import CreateControls from './edit-widget-control-creator';

class EditWidgetDialog extends React.Component {
  valid = true;


  constructor(props) {
    super(props);

    this.state = {
      temporal: {},
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      temporal: props.widget
    };
  }



  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        this.props.onClose(this.state.temporal);
      }
    } else {
      this.props.onClose();
    }
  }

  assignAspectRatio(changeObject, fileId) {
    // get aspect ratio of file
    const file = this.props.files.find(element => element.id === fileId);

    // scale width to match aspect
    const aspectRatio = file.dimensions.width / file.dimensions.height;
    changeObject.width = this.state.temporal.height * aspectRatio;

    return changeObject;
  }

  handleChange(e) {
  // TODO: check what we really need in this function. Can we reduce its complexity?
     if (e.constructor === Array) {
      // Every property in the array will be updated
      let changes = e.reduce( (changesObject, event) => {
        changesObject[event.target.id] = event.target.value;

        return changesObject;
      }, {});

      this.setState({ temporal: Object.assign({}, this.state.temporal, changes ) });
    }

        if(e.target.type !== 'text'){
        let changeObject = {};
        if (e.target.id === 'lockAspect') {
          changeObject[e.target.id] = e.target.checked;

          // correct image aspect if turned on
          if (e.target.checked) {
            changeObject = this.assignAspectRatio(changeObject, this.state.temporal.file);
          }
        } else if (e.target.id === 'file') {
          changeObject[e.target.id] = e.target.value;

          // get file and update size (if it's an image)
          if ('lockAspect' in this.state.temporal && this.state.temporal.lockAspect) {
            changeObject = this.assignAspectRatio(changeObject, e.target.value);
          }
        } else if (e.target.type === 'checkbox') {
          changeObject[e.target.id] = e.target.checked;
        } else if (e.target.type === 'number') {
          changeObject[e.target.id] = Number(e.target.value);
        }

        else {
          changeObject[e.target.id] = e.target.value;
        }


        let finalChange = this.state.temporal;

        finalChange.customProperties[e.target.id] = changeObject[e.target.id];
        this.setState({ temporal: finalChange});
      }
      else{
        if(this.state.temporal[e.target.id]){
          let finalChange = this.state.temporal;

          finalChange[e.target.id] = e.target.value;
          this.setState({ temporal: finalChange});
        }
      }
  }

  resetState() {
    var widget_data = Object.assign({}, this.props.widget);
    this.setState({ temporal: widget_data });
  }

  validateForm(target) {
    // check all controls
    var name = true;

    if (this.state.name === '') {
      name = false;
    }

    //this.valid = name;
    this.valid = name;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
  }

  render() {
    let controls = null;
    if (this.props.widget) {
      controls = CreateControls(
            this.props.widget.type,
            this.state.temporal,
            this.props.sessionToken,
            this.props.files,
            (id) => this.validateForm(id),
            this.props.simulationModels,
            (e) => this.handleChange(e));
    }

    return (
      <Dialog show={this.props.show} title="Edit Widget" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form encType='multipart/form-data'>
          { controls || '' }
        </form>
      </Dialog>
    );
  }
}

export default EditWidgetDialog;

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
//import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';

import Dialog from '../../common/dialogs/dialog';

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
      if (this.validChanges()) {
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
    if(file.dimensions){
    const aspectRatio = file.dimensions.width / file.dimensions.height;
    changeObject.width = this.state.temporal.height * aspectRatio;
    }

    return changeObject;
  }

  handleChange(e) {

    // TODO: check what we really need in this function. Can we reduce its complexity?
    let parts = e.target.id.split('.');
    let changeObject = this.state.temporal;
    let customProperty = true;
    if (parts.length === 1) {
      // not a customProperty
      customProperty = false;
    }
    
    if (parts[1] === 'lockAspect') {
      //not a customProperty
      customProperty ? changeObject[parts[0]][parts[1]] = e.target.checked : changeObject[e.target.id] = e.target.checked;

      // correct image aspect if turned on
      if (e.target.checked && this.state.temporal.customProperties.file) {
        changeObject = this.assignAspectRatio(changeObject, this.state.temporal.customProperties.file);
      }
    } else if (e.target.id.includes('file')) {

      customProperty ? changeObject[parts[0]][parts[1]] = e.target.value : changeObject[e.target.id] = e.target.value;

      // get file and update size (if it's an image)
      if ('lockAspect' in this.state.temporal && this.state.temporal.lockAspect) {
        // TODO this if condition requires changes to work!!!
        changeObject = this.assignAspectRatio(changeObject, e.target.value);
      }
    } else if (e.target.type === 'number') {
      customProperty ?  changeObject[parts[0]][parts[1]] = Number(e.target.value) : changeObject[e.target.id] = Number(e.target.value);
    } else if(e.target.id === 'name'){
      if(customProperty ? (changeObject[parts[0]][parts[1]] != null) : (changeObject[e.target.id] != null)){
        customProperty ? changeObject[parts[0]][parts[1]]= e.target.value : changeObject[e.target.id] = e.target.value;
      } else{
        customProperty ? changeObject[parts[0]][parts[1]]= 'default' : changeObject[e.target.id] = 'default';
      }
    } else {
      customProperty ? changeObject[parts[0]][parts[1]] = e.target.value : changeObject[e.target.id] = e.target.value ;
    }
    this.validChanges();
    this.setState({ temporal: changeObject});

  }

  resetState() {
    let widget_data = Object.assign({}, this.props.widget);
    this.setState({ temporal: widget_data });
  }

  validChanges() {
    // check that widget has a name
    var name = true;

    if (this.state.temporal[name] === '') {
      name = false;
    }

    this.valid = name;
    return name;
  }

  render() {

    let controls = null;
    if (this.props.widget) {
      controls = CreateControls(
            this.props.widget.type,
            this.state.temporal,
            this.props.sessionToken,
            this.props.files,
            this.props.signals,
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

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
import { Form } from 'react-bootstrap';
import Dialog from '../../../../common/dialogs/dialog';
import CreateControls from './edit-widget-control-creator';

class EditWidgetDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      temporal: props.widget,
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      temporal: props.widget
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      this.props.onClose(this.state.temporal);
    } else {
      this.props.onClose();
    }
  }

  assignAspectRatio(changeObject, fileId) {
    fileId = parseInt(fileId, 10)
    // get aspect ratio of file
    const file = this.props.files.find(element => element.id === fileId);

    // scale width to match aspect
    if (file.imageWidth && file.imageHeight) {
      const aspectRatio = file.imageWidth / file.imageHeight;
      changeObject.width = parseInt(this.state.temporal.height * aspectRatio,10);
    }

    return changeObject;
  }

  getTextWidth(text, fontSize) {
    let font = fontSize + "px ariel";
    let canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
  }

  setMaxWidth(changeObject) {
    if (changeObject.type === 'Label') {
      changeObject.customProperties.maxWidth = Math.ceil(this.getTextWidth(changeObject.name, changeObject.customProperties.textSize));
      changeObject.width = changeObject.customProperties.maxWidth;
    }

    return changeObject;
  }

  setNewLockRestrictions(changeObject) {
    if (changeObject.customProperties.orientation === 0) {
      changeObject.customProperties.resizeTopBottomLock = true;
      changeObject.customProperties.resizeLeftRightLock = false;
    }
    else if (changeObject.customProperties.orientation === 1) {
      changeObject.customProperties.resizeTopBottomLock = false;
      changeObject.customProperties.resizeLeftRightLock = true;
    }
    return changeObject;
  }

  handleChange(e) {
    // TODO: check what we really need in this function. Can we reduce its complexity?
    let parts = e.target.id.split('.');
    // creating a deep copy of an object to be updated
    //let changeObject = JSON.parse(JSON.stringify(this.state.temporal));;
    let changeObject = this.state.temporal;
    let customProperty = true;
    if (parts.length === 1) {
      // not a customProperty
      customProperty = false;
    }

    if (parts[1] === 'lockAspect') {
      //not a customProperty
      if(typeof e.target.value === "boolean"){
        customProperty ? changeObject[parts[0]][parts[1]] = e.target.value : changeObject[e.target.id] = e.target.value;
      }else{
      customProperty ? changeObject[parts[0]][parts[1]] = e.target.checked : changeObject[e.target.id] = e.target.checked;
      }

      // correct image aspect if turned on
      if (e.target.checked && (this.state.temporal.customProperties.file !== -1)) {
        changeObject = this.assignAspectRatio(changeObject, this.state.temporal.customProperties.file);
      }
    } else if (e.target.id.includes('file')) {
      if (e.target.value === "Select file")
      {
        customProperty ? changeObject[parts[0]][parts[1]] = -1 : changeObject[e.target.id] = -1;
      } else {
        if(this.state.temporal.customProperties.lockAspect){
          changeObject = this.assignAspectRatio(changeObject, e.target.value);
        }
        customProperty ? changeObject[parts[0]][parts[1]] = e.target.value : changeObject[e.target.id] = e.target.value;
      }

    } else if (parts[1] === 'textSize'){
      changeObject[parts[0]][parts[1]] = Number(e.target.value);
      changeObject = this.setMaxWidth(changeObject);

    } else if(parts[1] === 'orientation'){
      customProperty ? changeObject[parts[0]][parts[1]] = e.target.value : changeObject[e.target.id] = e.target.value ;
      changeObject = this.setNewLockRestrictions(changeObject);
    } else if (e.target.type === 'number') {
      customProperty ?  changeObject[parts[0]][parts[1]] = Number(e.target.value) : changeObject[e.target.id] = Number(e.target.value);
    } else if(e.target.id === 'name'){
      if(customProperty ? (changeObject[parts[0]][parts[1]] != null) : (changeObject[e.target.id] != null)){
        customProperty ? changeObject[parts[0]][parts[1]]= e.target.value : changeObject[e.target.id] = e.target.value;
      } else{
        customProperty ? changeObject[parts[0]][parts[1]]= 'default' : changeObject[e.target.id] = 'default';
      }
      changeObject = this.setMaxWidth(changeObject);
    } else if (parts[1] === 'horizontal'){
      customProperty ? changeObject[parts[0]][parts[1]] = e.target.value : changeObject[e.target.id] = e.target.value ;
      let tempWidth = changeObject.width;
      changeObject.width = changeObject.height;
      changeObject.height = tempWidth;
    } else {
      customProperty ? changeObject[parts[0]][parts[1]] = e.target.value : changeObject[e.target.id] = e.target.value ;
    }
    
    console.log(changeObject)

    this.setState({ temporal: changeObject});
  }

  resetState() {
    let widget_data = Object.assign({}, this.props.widget);
    this.setState({ temporal: widget_data });
  }

  render() {

    let controls = null;
    if (this.props.widget) {
      controls = CreateControls(
            this.props.widget.type,
            this.state.temporal,
            this.props.sessionToken,
            this.props.files,
            this.props.ics,
            this.props.configs,
            this.props.signals,
            (e) => this.handleChange(e));
    }

    return (
      <Dialog
        show={this.props.show}
        title="Edit Widget"
        buttonTitle="Save"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid}
        size={'sm'}
      >
        <Form encType='multipart/form-data'>
          { controls || '' }
        </Form>
      </Dialog>
    );
  }
}

export default EditWidgetDialog;

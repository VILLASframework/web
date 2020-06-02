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
import {FormGroup, FormControl, FormLabel, Button} from 'react-bootstrap';


import Dialog from '../common/dialogs/dialog';


class EditFilesDialog extends React.Component {
  valid = true;


  constructor(props) {
    super(props);

    this.state = {
      files: [],  
      selectedFile: {},
      deleteData: [],
      addData: [],
      addFile: {}
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      files: props.files
    };
  }



  onClose(canceled) {
    if (canceled === false) {
      if (this.validChanges()) {
        this.props.onClose(this.state.files,this.state.deleteData,this.state.addData);
      }
    } else {
      this.props.onClose();
    }
  }
//can you add file to state array?
  addFile(){
  let addFile = this.state.addFile[0];
  addFile.id = this.state.files[this.state.files.length -1 ].id +1;
   let tempFiles = this.state.files;
   tempFiles.push(addFile);
   this.setState({files: tempFiles});

   let tempAddFiles = this.state.addData;
   tempAddFiles.push(addFile);
   this.setState({addData: tempAddFiles});

   this.setState({addFile: {}});

  }

  deleteFile(){
    let tempFiles = this.state.files;
    let changeId = false;
    for (let i = 0; i < tempFiles.length; i++) { 
      if(changeId){
        tempFiles[i-1] = tempFiles[i];
      }
      else if(tempFiles[i].id === this.state.selectedFile.id){
        changeId = true;
      }
    } 
    tempFiles.pop();
    this.setState({files: tempFiles});

    if(this.state.selectedFile.type !== "application/octet-stream"){
      let tempAddFiles = this.state.addData;
      let changePosition = false;
      for (let i = 0; i < tempAddFiles.length; i++) {
        if(changePosition){
          tempAddFiles[i-1] = tempAddFiles[i];
        } 
        else if(tempAddFiles[i].id === this.state.selectedFile.id){
          changePosition = true;
        }
      } 
      tempAddFiles.pop();
      this.setState({addData: tempAddFiles});
    }
    else{
    let tempDeleteFiles = this.state.deleteData;
    tempDeleteFiles.push(this.state.selectedFile);
    this.setState({deleteData: tempDeleteFiles});
    }


  }

  
  handleChange(e) {
    
    if(e.target.id === "selectedFile"){
    let tempFile = this.state.files.find(element => element.id === parseInt(e.target.value, 10));

    this.setState({ [e.target.id]: tempFile });
    }
    else if(e.target.id === "name"){
      if(this.state.selectedFile.type === "application/octet-stream"){
    
    let tempFile = this.state.selectedFile;
    tempFile.name = e.target.value;
    this.setState({selectedFile: tempFile});
    let tempFileList = this.state.files;
    tempFileList[tempFile.id - 1] = tempFile;
    this.setState({files: tempFileList});
      }
      else {
        const newFile = new File([this.state.selectedFile], e.target.value , {type: this.state.selectedFile.type});
        this.setState({selectedFile: newFile});
        let tempFileList = this.state.files;
        newFile.id = this.state.selectedFile.id;
        tempFileList[newFile.id - 1] = newFile;
        this.setState({files: tempFileList});

        let tempAddFiles = this.state.addData;
        for (let i = 0; i < tempAddFiles.length; i++) { 
          if(tempAddFiles[i].id === newFile.id){
            tempAddFiles[i] = newFile;
          }
        } 
        this.setState({addData: tempAddFiles});

      }
    
    }


  }

  validChanges() {
    return true;
  }

  render() {

    let fileOptions = [];
    if (this.state.files.length > 0){
      fileOptions.push(
        <option key = {0} default>Select image file</option>
        )
      fileOptions.push(this.state.files.map((file, index) => (
        <option key={index+1} value={file.id}>{file.name}</option>
      )))
    } else {
      fileOptions = <option disabled value style={{ display: 'none' }}>No files found, please upload one first.</option>
    }
    
    return (
      <Dialog show={this.props.show} title="Edit File" buttonTitle="Save" onClose={(c) => this.onClose(c)} valid={true}>
        <div>
          <FormGroup controlId="selectedFile">
            <FormLabel>Image</FormLabel>
            <FormControl
              as="select"
              value={this.state.selectedFile.id}
              onChange={(e) => this.handleChange(e)}>{fileOptions} </FormControl>
          </FormGroup>
      
          <FormGroup controlId={"name"}>
            <FormLabel>{"File Name"}</FormLabel>
            <FormControl type="text" placeholder={"Enter name"} value={this.state.selectedFile.name} onChange={e => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>

          <Button onClick={this.deleteFile.bind(this)}>Delete File</Button>

          <FormGroup controlId="upload">
            <FormLabel>Upload</FormLabel>
            <FormControl type="file" onChange={(e) => this.setState({ addFile: e.target.files })} />
          </FormGroup>

          <Button size='sm' onClick={this.addFile.bind(this)}>Add File</Button>
        </div>
      </Dialog>
    );
  }
}

export default EditFilesDialog;

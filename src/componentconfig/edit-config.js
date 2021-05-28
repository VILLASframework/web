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
import Form from "@rjsf/core";

import { Form as BForm } from 'react-bootstrap';
import { Multiselect } from 'multiselect-react-dropdown'
import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';


class EditConfigDialog extends React.Component {
  valid = false;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      icID: '',
      startParameters: {},
      formData: {},
      startparamTemplate: null,
      selectedFiles: [] // list of selected files {name, id}, this is not the fileIDs list of the config!
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        let data = this.props.config;
        if (this.state.name !== '' && this.props.config.name !== this.state.name) {
          data.name = this.state.name;
        }
        if (this.state.icID !== '' && this.props.config.icID !== parseInt(this.state.icID)) {
          data.icID = parseInt(this.state.icID, 10);
        }
        if (this.state.startParameters !== {} &&
          JSON.stringify(this.props.config.startParameters) !== JSON.stringify(this.state.startParameters)) {
          data.startParameters = this.state.startParameters;
        }

        let IDs = []
        for (let e of this.state.selectedFiles) {
          IDs.push(e.id)
        }
        if (this.props.config.fileIDs !== null && this.props.config.fileIDs !== undefined) {
          if (JSON.stringify(IDs) !== JSON.stringify(this.props.config.fileIDs)) {
            data.fileIDs = IDs;
          }
        }
        else {
          data.fileIDs = IDs
        }

        //forward modified config to callback function
        this.props.onClose(data)
      }
    } else {
      this.props.onClose();
    }

    this.setState({ startparamTemplate: null })
    this.valid = false
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
    this.valid = this.isValid()
  }

  changeIC(id) {
    let schema = null;
    if (this.props.ics) {
      let currentIC = this.props.ics.find(ic => ic.id === parseInt(id, 10));
      if (currentIC) {
        if (currentIC.startparameterschema !== null && currentIC.startparameterschema.hasOwnProperty('type')) {
          schema = currentIC.startparameterschema;
        }
      }
    }

    this.setState({
      icID: id,
      startparamTemplate: schema,
    });

    this.valid = this.isValid()
  }

  handleParameterChange(data) {
    if (data) {
      this.setState({ startParameters: data });
    }
    this.valid = this.isValid()
  }

  onFileChange(selectedList, changedItem) {
    this.setState({
      selectedFiles: selectedList
    })
    this.valid = this.isValid()
  }


  isValid() {
    // input is valid if at least one element has changed from its initial value
    return this.state.name !== ''
      || this.state.icID !== ''
      || this.state.startParameters !== {}
  }

  resetState() {

    // determine list of selected files incl id and filename
    let selectedFiles = []
    if (this.props.config.fileIDs !== null && this.props.config.fileIDs !== undefined) {
      for (let selectedFileID of this.props.config.fileIDs) {
        for (let file of this.props.files) {
          if (file.id === selectedFileID) {
            selectedFiles.push({ name: file.name, id: file.id })
          }
        }
      }
    }

    let schema = null;
    if (this.props.ics && this.props.config.icID) {
      let currentIC = this.props.ics.find(ic => ic.id === parseInt(this.props.config.icID, 10));
      if (currentIC) {
        if (currentIC.startparameterschema !== null && currentIC.startparameterschema.hasOwnProperty('type')) {
          schema = currentIC.startparameterschema;
        }
      }
    }

    this.setState({
      name: this.props.config.name,
      icID: this.props.config.icID,
      startParameters: this.props.config.startParameters,
      selectedFiles: selectedFiles,
      startparamTemplate: schema,
    });
  }

  handleFormChange({formData}) {
    this.setState({formData: formData, startParameters: formData})
    this.valid = this.isValid()
  }

  render() {
    const ICOptions = this.props.ics.map(s =>
      <option key={s.id} value={s.id}>{s.name}</option>
    );

    let configFileOptions = [];
    for (let file of this.props.files) {
      configFileOptions.push(
        { name: file.name, id: file.id }
      );
    }

    return (
      <Dialog
        show={this.props.show}
        title="Edit Component Configuration"
        buttonTitle="Save"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid}
      >
        <BForm>
          <BForm.Group controlId="name">
            <BForm.Label column={false}>Name</BForm.Label>
            <BForm.Control
              type="text"
              placeholder={this.props.config.name}
              value={this.state.name}
              onChange={(e) => this.handleChange(e)}
            />
            <BForm.Control.Feedback />
          </BForm.Group>

          <BForm.Group controlId="icID">
            <BForm.Label column={false}> Infrastructure Component </BForm.Label>
            <BForm.Control
              as="select"
              placeholder='Select infrastructure component'
              value={this.state.icID}
              onChange={(e) => this.changeIC(e.target.value)}
            >
              {ICOptions}
            </BForm.Control>
          </BForm.Group>

          <Multiselect
            options={configFileOptions}
            showCheckbox={true}
            selectedValues={this.state.selectedFiles}
            onSelect={(selectedList, selectedItem) => this.onFileChange(selectedList, selectedItem)}
            onRemove={(selectedList, removedItem) => this.onFileChange(selectedList, removedItem)}
            displayValue={'name'}
            placeholder={'Select file(s)...'}
          />

          <hr/>
          <BForm.Label><b>Start Parameters</b></BForm.Label>

          {!this.state.startparamTemplate ?
            <ParametersEditor
            content={this.state.startParameters}
            onChange={(data) => this.handleParameterChange(data)}
          />
          : <></>}
        </BForm>
        {this.state.startparamTemplate ?
            <Form
              schema={this.state.startparamTemplate}
              formData={this.state.formData}
              id='jsonFormData'
              onChange={({formData}) => this.handleFormChange({formData})}
              children={true} // hides submit button
              />
            : <></> }
      </Dialog>
    );
  }
}

export default EditConfigDialog;

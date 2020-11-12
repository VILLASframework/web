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
import { FormGroup, FormControl, FormLabel, FormCheck } from 'react-bootstrap';
import _ from 'lodash';
import {Collapse} from 'react-collapse';
import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';

class EditICDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      websocketurl: '',
      apiurl: '',
      location: '',
      description: '',
      type: '',
      category: '',
      managedexternally: false,
      startParameterScheme: {},
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        let data = this.props.ic;

        if (this.state.name != null && this.state.name !== "" && this.state.name !== this.props.ic.name) {
          data.name = this.state.name;
        }

        if (this.state.websocketurl != null && this.state.websocketurl !== "" && this.state.websocketurl !== "http://" && this.state.websocketurl !== this.props.ic.websocketurl) {
          data.websocketurl = this.state.websocketurl;
        }

        if (this.state.apiurl != null && this.state.apiurl !== "" && this.state.apiurl !== "http://" && this.state.apiurl !== this.props.ic.apiurl) {
          data.apiurl = this.state.apiurl;
        }

        if (this.state.location != null && this.state.location !== this.props.ic.location) {
          data.location = this.state.location;
        }

        if (this.state.description != null && this.state.description !== this.props.ic.description) {
          data.description = this.state.description;
        }

        if (this.state.type != null && this.state.type !== "" && this.state.type !== this.props.ic.type) {
          data.type = this.state.type;
        }

        if (this.state.category != null && this.state.category !== "" && this.state.category !== this.props.ic.category) {
          data.category = this.state.category;
        }
        if (this.state.startParameterScheme !== {}) {
          data.startParameterScheme = this.state.startParameterScheme
        }

        data.managedexternally = this.state.managedexternally;


        this.props.onClose(data);
        this.setState({managedexternally: false});
      }
    } else {
      this.props.onClose();
      this.setState({managedexternally: false});
    }
  }

  handleChange(e) {
    if(e.target.id === "managedexternally"){
      this.setState({ managedexternally : !this.state.managedexternally});
    }
    else{
    this.setState({ [e.target.id]: e.target.value });
    }
  }

  handleStartParameterSchemeChange(data) {
    this.setState({ startParameterScheme: data });
  }

  resetState() {
    this.setState({
      name: this.props.ic.name,
      websocketurl: this.props.ic.websocketurl,
      apiurl: this.props.ic.apiurl,
      type: this.props.ic.type,
      location: this.props.ic.location,
      description: this.props.ic.description,
      category: this.props.ic.category,
      managedexternally: false,
      startParameterScheme: this.props.ic.startParameterScheme,
    });
  }

  render() {
    let typeOptions = [];
    switch(this.state.category){
      case "Simulator":
        typeOptions = ["Dummy","Generic","DPsim","RTLAB","RSCAD"];
          break;
      case "Controller":
        typeOptions = ["Kubernetes","VILLAS-controller"];
        break;
      case "Gateway":
        typeOptions = ["VILLASnode","VILLASrelay"];
        break;
      case "Service":
        typeOptions = ["EMS","Custom"];
        break;
      case "Equipment":
        typeOptions = ["Chroma-emulator","Chroma-loads","SMA-sunnyboy","FLEPS","Sonnenbatterie"];
        break;
      default:
        typeOptions =[];
    }
    return (
      <Dialog
        show={this.props.show}
        title="Edit Infrastructure Component"
        buttonTitle="Save"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid}
        size='lg'
      >
        <form>
          <FormLabel column={false}>UUID: {this.props.ic.uuid}</FormLabel>
          <FormGroup controlId="name">
            <FormLabel column={false}>Name</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.name} value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="category">
            <FormLabel column={false}>Category</FormLabel>
            <FormControl as="select" value={this.state.category} onChange={(e) => this.handleChange(e)}>
              <option>Simulator</option>
              <option>Controller</option>
              <option>Service</option>
              <option>Gateway</option>
              <option>Equipment</option>
            </FormControl>
          </FormGroup>
          <FormGroup controlId="type">
            <FormLabel column={false}>Type</FormLabel>
            <FormControl as="select" value={this.state.type} onChange={(e) => this.handleChange(e)}>
              <option default>Select type</option>
              {typeOptions.map((name,index) => (
                <option key={index}>{name}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="websocketurl">
            <FormLabel column={false}>Websocket URL</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.websocketurl} value={this.state.websocketurl || 'http://' } onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="apiurl">
            <FormLabel column={false}>API URL</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.apiurl} value={this.state.apiurl || 'http://' } onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="location">
            <FormLabel column={false}>Location</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.location} value={this.state.location || '' } onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="description">
            <FormLabel column={false}>Description</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.description} value={this.state.description || '' } onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId='startParameterScheme'>
            <FormLabel column={false}>Start parameter scheme of IC</FormLabel>
            <ParametersEditor
              content={this.state.startParameterScheme}
              disabled={false}
              onChange={(data) => this.handleStartParameterSchemeChange(data)}
            />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditICDialog;

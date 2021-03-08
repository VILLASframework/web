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
      properties: {}
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        let data = this.props.ic;

        if (this.state.name != null && this.state.name !== "" && this.state.name !== this.props.ic.name) {
          data.name = this.state.name;
        }

        data.websocketurl = this.state.websocketurl;
        data.apiurl = this.state.apiurl;

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

        data.startParameterScheme = this.state.startParameterScheme
        data.properties = this.state.properties

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

  handlePropertiesChange(data) {
    this.setState({ properties: data });
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
      properties: this.props.ic.properties,
    });
  }

  render() {
    let typeOptions = [];
    switch(this.state.category){
      case "simulator":
        typeOptions = ["dummy","generic","dpsim","rtlab","rscad","rtlab","kubernetes"];
        break;
      case "manager":
        typeOptions = ["villas-node","villas-relay","generic"];
        break;
      case "gateway":
        typeOptions = ["villas-node","villas-relay"];
        break;
      case "service":
        typeOptions = ["ems","custom"];
        break;
      case "equipment":
        typeOptions = ["chroma-emulator","chroma-loads","sma-sunnyboy","fleps","sonnenbatterie"];
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
              <option>simulator</option>
              <option>service</option>
              <option>gateway</option>
              <option>equipment</option>
              <option>manager</option>
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
            <FormControl type="text" placeholder={this.props.ic.websocketurl} value={this.state.websocketurl} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="apiurl">
            <FormLabel column={false}>API URL</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.apiurl} value={this.state.apiurl} onChange={(e) => this.handleChange(e)} />
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
          <FormGroup controlId='properties'>
            <FormLabel column={false}>Properties</FormLabel>
            <ParametersEditor
              content={this.state.properties}
              disabled={true}
              onChange={(data) => this.handlePropertiesChange(data)}
            />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditICDialog;

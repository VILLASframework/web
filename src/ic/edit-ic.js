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
      host: '',
      type: '',
      category: '',
      managedexternally: false,
      properties: {},
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        let data = this.props.ic;

        if (this.state.name != null && this.state.name !== "" && this.state.name !== this.props.ic.name) {
          data.name = this.state.name;
        }

        if (this.state.host != null && this.state.host !== "" && this.state.host !== "http://" && this.state.host !== this.props.ic.host) {
          data.host = this.state.host;
        }

        if (this.state.type != null && this.state.type !== "" && this.state.type !== this.props.ic.type) {
          data.type = this.state.type;
        }

        if (this.state.category != null && this.state.category !== "" && this.state.category !== this.props.ic.category) {
          data.category = this.state.category;
        }
        if (this.state.properties !== {}) {
          data.properties = this.state.properties
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

  handlePropertiesChange(data) {
    this.setState({ properties: data });
  }

  resetState() {
    this.setState({
      name: this.props.ic.name,
      host: this.props.ic.host,
      type: this.props.ic.type,
      category: this.props.ic.category,
      managedexternally: false,
      properties: _.merge({}, _.get(this.props.ic, 'rawProperties'), _.get(this.props.ic, 'properties'))
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
        typeOptions = ["VILLAS-node","VILLAS-relay"];
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
          <FormGroup controlId="managedexternally">
            <FormCheck type={"checkbox"} label={"Managed externally"} defaultChecked={this.state.managedexternally} onChange={e => this.handleChange(e)}>
            </FormCheck>
          </FormGroup>
          <Collapse isOpened={this.state.managedexternally} >
            <FormLabel size="sm">Externally managed ICs cannot be edited by users</FormLabel>
          </Collapse>
          <FormGroup controlId="name">
            <FormLabel column={false}>Name</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.name} value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="host">
            <FormLabel column={false}>Host</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.host} value={this.state.host || 'http://' } onChange={(e) => this.handleChange(e)} />
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
          <FormGroup controlId='properties'>
            <FormLabel column={false}>Properties</FormLabel>
            <ParametersEditor
              content={this.state.properties}
              disabled={false}
              onChange={(data) => this.handlePropertiesChange(data)}
            />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditICDialog;

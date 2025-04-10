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
import { Form, Col, Row } from 'react-bootstrap';
import Dialog from '../../../common/dialogs/dialog';
import ParametersEditor from '../../../common/parameters-editor';
import NotificationsDataManager from "../../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../../common/data-managers/notifications-factory";

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
      icstate: '',
      managedexternally: false,
      startparameterschema: {}
    };
  }


  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        let data = JSON.parse(JSON.stringify(this.props.ic));

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

        if (this.state.icstate != null && this.state.icstate !== "" && this.state.icstate !== this.props.ic.state) {
          data.state = this.state.icstate;
        }

        if (Object.keys(this.state.startparameterschema).length === 0 && this.state.startparameterschema.constructor === Object) {
          data.startparameterschema = this.state.startparameterschema;
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

  handleStartParameterSchemaChange(data) {
    this.setState({ startparameterschema: data });
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
      icstate: this.props.ic.state,
      managedexternally: false,
      startparameterschema: this.props.ic.startparameterschema || {},
    });
  }

  selectStartParamsFile(event) {
    const file = event.target.files[0];

    if (!file.type.match('application/json')) {
      console.error("Not a json file. Will not process file '" + file.name + "'.")
      NotificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR("Not a json file. Will not process file \'" + file.name + "\'."));
      return;
    }

    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = event => {
      const params = JSON.parse(reader.result);
      this.setState({ startparameterschema: params})
    }
  };

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

    let stateOptions = ["idle", "starting", "running", "pausing", "paused", "resuming", "stopping", "resetting", "error", "gone", "shuttingdown", "shutdown"];

    return (
      <Dialog
        show={this.props.show}
        title="Edit Infrastructure Component"
        buttonTitle="Save"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.valid}
      >
        <Form>
          <Form.Label column={false}>UUID: {this.props.ic.uuid}</Form.Label>
          <Form.Group controlId="name" style={{marginBottom: '15px'}}>
            <Form.Label column={false}>Name</Form.Label>
            <Form.Control type="text" placeholder={this.props.ic.name} value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group controlId="category" style={{marginBottom: '15px'}}>
            <Form.Label column={false}>Category</Form.Label>
            <Form.Control as="select" value={this.state.category} onChange={(e) => this.handleChange(e)}>
              <option>simulator</option>
              <option>service</option>
              <option>gateway</option>
              <option>equipment</option>
              <option>manager</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="type" style={{marginBottom: '15px'}}>
            <Form.Label column={false}>Type</Form.Label>
            <Form.Control as="select" value={this.state.type} onChange={(e) => this.handleChange(e)}>
              <option default>Select type</option>
              {typeOptions.map((name,index) => (
                <option key={index}>{name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          {
            this.state.type === "dummy" ?
            <Form.Group controlId="icstate" style={{marginBottom: '15px'}}>
            <Form.Label column={false}>State</Form.Label>
            <Form.Control as="select" value={this.state.icstate} onChange={(e) => this.handleChange(e)}>
              <option default>Select State</option>
              {stateOptions.map((name,index) => (
                <option key={index}>{name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          : <></>
          }
          <Form.Group controlId="websocketurl" style={{marginBottom: '15px'}}>
            <Form.Label column={false}>Websocket URL</Form.Label>
            <Form.Control type="text" placeholder={this.props.ic.websocketurl} value={this.state.websocketurl} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group controlId="apiurl" style={{marginBottom: '15px'}}>
            <Form.Label column={false}>API URL</Form.Label>
            <Form.Control type="text" placeholder={this.props.ic.apiurl} value={this.state.apiurl} onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group controlId="location" style={{marginBottom: '15px'}}>
            <Form.Label column={false}>Location</Form.Label>
            <Form.Control type="text" placeholder={this.props.ic.location} value={this.state.location || '' } onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label column={false}>Description</Form.Label>
            <Form.Control type="text" placeholder={this.props.ic.description} value={this.state.description || '' } onChange={(e) => this.handleChange(e)} />
            <Form.Control.Feedback />
          </Form.Group>
          <hr/>
          <Form.Group controlId='startParameterSchema' >
            <Form.Label column={false}>Start parameter schema of IC</Form.Label>
            <ParametersEditor
              content={this.state.startparameterschema}
              onChange={(data) => this.handleStartParameterSchemaChange(data)}
              disabled={true}
            />
            <Form.Label style={{marginTop: '15px'}} column={false}>Select JSON file to update start parameter schema: </Form.Label>
            <Form.Control type='file' onChange={(event) => this.selectStartParamsFile(event)} />
          </Form.Group>
        </Form>
      </Dialog>
    );
  }
}

export default EditICDialog;

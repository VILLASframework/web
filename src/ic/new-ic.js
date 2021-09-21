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
import { Form as BForm, OverlayTrigger, Tooltip} from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';
import Form from "@rjsf/core";
import $RefParser from '@apidevtools/json-schema-ref-parser';

class NewICDialog extends React.Component {
  valid = false;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      websocketurl: '',
      apiurl: '',
      uuid: '',
      type: '',
      category: '',
      managedexternally: false,
      description: '',
      location: '',
      manager: '',
      properties: {},
      schema: {}
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        const parameters = {
          name: this.state.name,
          type: this.state.type,
          category: this.state.category,
          uuid: this.state.uuid,
          location: this.state.location,
          description: this.state.description,
        }

        const data = {
          managedexternally: this.state.managedexternally,
          manager: this.state.manager,
          name: this.state.name,
          type: this.state.type,
          category: this.state.category,
          uuid: this.state.uuid,
          description: this.state.description,
          location: this.state.location,
          parameters: parameters
        };

        // Add custom properties
        if (this.state.managedexternally)
          Object.assign(parameters, this.state.properties);

        if (this.state.websocketurl != null && this.state.websocketurl !== "") {
          parameters.websocketurl = this.state.websocketurl;
          data.websocketurl = this.state.websocketurl;
        }

        if (this.state.apiurl != null && this.state.apiurl !== "") {
          parameters.apiurl = this.state.apiurl;
          data.apiurl = this.state.apiurl;
        }

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

  setManager(e) {
    this.setState({ [e.target.id]: e.target.value });

    if (this.props.managers) {
      let schema = this.props.managers.find(m => m.uuid === e.target.value).createparameterschema
      if (schema) {
        $RefParser.dereference(schema, (err, deref) => {
          if (err) {
            console.error(err)
          }
          else {
            this.setState({schema: schema})
          }
        })
      }
    }
  }

  handlePropertiesChange = properties => {
    this.setState({
      properties: properties
    });
  };

  handleFormChange({formData}) {
    this.setState({properties: formData})
  }

  resetState() {
    this.setState({
      name: '',
      websocketurl: '',
      apiurl: '',
      uuid: this.uuidv4(),
      type: '',
      category: '',
      managedexternally: false,
      description: '',
      location: '',
      properties: {},
    });
  }

  validateForm(target) {

    if (this.state.managedexternally) {
      this.valid = this.state.manager !== '';
      return this.state.manager !== '' ? "success" : "error";
    }

    // check all controls
    let name = true;
    let uuid = true;
    let type = true;
    let category = true;

    if (this.state.name === '') {
      name = false;
    }

    if (this.state.uuid === '') {
      uuid = false;
    }

    if (this.state.type === '') {
      type = false;
    }

    if (this.state.category === '') {
      category = false;
    }

    this.valid = name && uuid &&  type && category;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    if (target === 'uuid') return uuid ? "success" : "error";
    if (target === 'type') return type ? "success" : "error";
    if (target === 'category') return category ? "success" : "error";

    return this.valid;
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      // eslint-disable-next-line
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  render() {
    let typeOptions = [];
    switch(this.state.category){
      case "simulator":
        typeOptions = ["dummy","generic","dpsim","rtlab","rscad","rtlab","kubernetes"];
          break;
      case "manager":
        typeOptions = ["villas-node","villas-relay","generic","kubernetes"];
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

    let managerOptions = [];
    managerOptions.push(<option key={-1} value={"Select manager"} defaultChecked={true}>Select manager</option>);
    for (let m of this.props.managers) {
      managerOptions.push (
        <option key={m.id} value={m.uuid}>{m.name}</option>
      );
    }

    return (
      <Dialog
        show={this.props.show}
        title="New Infrastructure Component"
        buttonTitle="Add"
        onClose={(c) => this.onClose(c)}
        onReset={() => this.resetState()}
        valid={this.validateForm()}
      >
        {this.props.managers.length > 0 ?
          <BForm>
            <BForm.Group controlId="managedexternally">
              <OverlayTrigger key="-1" placement={'left'}
                              overlay={<Tooltip id={`tooltip-${"me"}`}>An externally managed component is created and
                                managed by an IC manager via AMQP</Tooltip>}>
                <BForm.Check type={"checkbox"} label={"Use manager"} defaultChecked={this.state.managedexternally}
                             onChange={e => this.handleChange(e)}>
                </BForm.Check>
              </OverlayTrigger>
            </BForm.Group>
          </BForm> : <></>
        }
        {this.state.managedexternally === true ?
          <>

          <BForm>
            <BForm.Group controlId="manager" valid={this.validateForm('manager')}>
              <OverlayTrigger key="0" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
                <BForm.Label>Manager to create new IC *</BForm.Label>
              </OverlayTrigger>
              <BForm.Control as="select" value={this.state.manager} onChange={(e) => this.setManager(e)}>
                {managerOptions}
              </BForm.Control>
            </BForm.Group>
          </BForm>

          {this.state.schema ?
            <Form
              schema={this.state.schema}
              formData={this.state.properties}
              id='jsonFormData'
              onChange={({formData}) => this.handleFormChange({formData})}
              children={true} // hides submit button
            />
          :
            <BForm>
              <BForm.Group controlId="properties">
                <BForm.Label>Create Properties</BForm.Label>
                  <ParametersEditor
                    content={this.state.properties}
                    onChange={(data) => this.handlePropertiesChange(data)}
                  />
              </BForm.Group>
            </BForm>
        }
          </>
        :
          <BForm>
            <BForm.Group controlId="name" valid={this.validateForm('name')}>
              <OverlayTrigger key="1" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
                <BForm.Label>Name *</BForm.Label>
              </OverlayTrigger>
              <BForm.Control type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
              <BForm.Control.Feedback />
            </BForm.Group>

            <BForm.Group controlId="uuid" valid={this.validateForm('uuid')}>
              <BForm.Label>UUID</BForm.Label>
              <BForm.Control type="text" placeholder="Enter uuid" value={this.state.uuid}
                onChange={(e) => this.handleChange(e)}/>
              <BForm.Control.Feedback/>
            </BForm.Group>

            <BForm.Group controlId="location">
              <BForm.Label>Location</BForm.Label>
              <BForm.Control type="text" placeholder="Enter Location" value={this.state.location} onChange={(e) => this.handleChange(e)} />
              <BForm.Control.Feedback />
            </BForm.Group>

            <BForm.Group controlId="description">
              <BForm.Label>Description</BForm.Label>
              <BForm.Control type="text" placeholder="Enter Description" value={this.state.description} onChange={(e) => this.handleChange(e)} />
              <BForm.Control.Feedback />
            </BForm.Group>

            <BForm.Group controlId="category" valid={this.validateForm('category')}>
              <OverlayTrigger key="2" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
                <BForm.Label>Category of component *</BForm.Label>
              </OverlayTrigger>
              <BForm.Control as="select" value={this.state.category} onChange={(e) => this.handleChange(e)}>
                <option default>Select category</option>
                <option value="simulator">Simulator</option>
                <option value="service">Service</option>
                <option value="gateway">Gateway</option>
                <option value="equipment">Equipment</option>
                <option value="manager">Manager</option>
              </BForm.Control>
            </BForm.Group>

            <BForm.Group controlId="type" valid={this.validateForm('type')}>
              <OverlayTrigger key="3" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
                <BForm.Label>Type of component *</BForm.Label>
             </OverlayTrigger>
              <BForm.Control as="select" value={this.state.type} onChange={(e) => this.handleChange(e)}>
                <option default>Select type</option>
                  {typeOptions.map((name,index) => (
                     <option key={index}>{name}</option>
                  ))}
              </BForm.Control>
            </BForm.Group>

            <BForm.Group controlId="websocketurl">
              <BForm.Label>Websocket URL</BForm.Label>
              <BForm.Control type="text" placeholder="https://" value={this.state.websocketurl} onChange={(e) => this.handleChange(e)} />
              <BForm.Control.Feedback />
            </BForm.Group>

            <BForm.Group controlId="apiurl">
              <BForm.Label>API URL</BForm.Label>
              <BForm.Control type="text" placeholder="https://" value={this.state.apiurl} onChange={(e) => this.handleChange(e)} />
              <BForm.Control.Feedback />
            </BForm.Group>
          </BForm>
        }
      </Dialog>
    );
  }
}

export default NewICDialog;

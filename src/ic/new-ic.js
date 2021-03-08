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
import { FormGroup, FormControl, FormLabel, FormCheck, OverlayTrigger, Tooltip} from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';

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
      manager: ''
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        const data = {
          name: this.state.name,
          type: this.state.type,
          category: this.state.category,
          uuid: this.state.uuid,
          managedexternally: this.state.managedexternally,
          location: this.state.location,
          description: this.state.description,
          manager: this.state.manager
        };

        if (this.state.websocketurl != null && this.state.websocketurl !== "" && this.state.websocketurl !== 'http://') {
          data.websocketurl = this.state.websocketurl;
        }

        if (this.state.apiurl != null && this.state.apiurl !== "" && this.state.apiurl !== 'http://') {
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

  resetState() {
    this.setState({ name: '', websocketurl: 'http://', apiurl: 'http://', uuid: this.uuidv4(), type: '', category: '', managedexternally: false, description: '', location: ''});
  }

  validateForm(target) {
    // check all controls
    let name = true;
    let uuid = true;
    let websocketurl = true;
    let type = true;
    let category = true;
    let manager = true;

    if (this.state.name === '') {
      name = false;
    }

    if (!this.state.managedexternally && this.state.uuid === '') {
      uuid = false;
    }

    if(this.state.managedexternally && manager === ''){
      manager = false;
    }

    if (this.state.type === '') {
      type = false;
    }

    if (this.state.category === '') {
      category = false;
    }

    this.valid = name && uuid && websocketurl && type && category && manager;

    // return state to control
    if (target === 'name') return name ? "success" : "error";
    if (target === 'uuid') return uuid ? "success" : "error";
    if (target === 'websocketurl') return websocketurl ? "success" : "error";
    if (target === 'type') return type ? "success" : "error";
    if (target === 'category') return category ? "success" : "error";
    if (target === 'manager') return manager ? "success" : "error";

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
        typeOptions = ["dummy","generic","dpsim","rtlab","rscad","opalrt"];
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

    let managerOptions = [];
    managerOptions.push(<option default>Select manager</option>);
    for (let m of this.props.managers) {
      managerOptions.push (
        <option key={m.id} value={m.uuid}>{m.name}</option>
      );
    }

    return (
      <Dialog show={this.props.show} title="New Infrastructure Component" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.validateForm()}>
        <form>
          {this.props.managers.length > 0 ?
            <>
              <FormGroup controlId="managedexternally">
                <OverlayTrigger key="-1" placement={'left'} overlay={<Tooltip id={`tooltip-${"me"}`}>An externally managed component is created and managed by an IC manager via AMQP</Tooltip>} >
                  <FormCheck type={"checkbox"} label={"Managed externally"} defaultChecked={this.state.managedexternally} onChange={e => this.handleChange(e)}>
                  </FormCheck>
                </OverlayTrigger>
              </FormGroup>
              {this.state.managedexternally === true ?
                <FormGroup controlId="manager" valid={this.validateForm('manager')}>
                  <OverlayTrigger key="0" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
                    <FormLabel>Manager to create new IC *</FormLabel>
                  </OverlayTrigger>
                  <FormControl as="select" value={this.state.manager} onChange={(e) => this.handleChange(e)}>
                    {managerOptions}
                  </FormControl>
                </FormGroup>
                : <div/>
              }
            </>
            : <div/>
          }
          <FormGroup controlId="name" valid={this.validateForm('name')}>
          <OverlayTrigger key="1" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
            <FormLabel>Name *</FormLabel>
          </OverlayTrigger>
            <FormControl type="text" placeholder="Enter name" value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="category" valid={this.validateForm('category')}>
            <OverlayTrigger key="2" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
              <FormLabel>Category of component *</FormLabel>
            </OverlayTrigger>
            <FormControl as="select" value={this.state.category} onChange={(e) => this.handleChange(e)}>
              <option default>Select category</option>
              <option>simulator</option>
              <option>service</option>
              <option>gateway</option>
              <option>equipment</option>
              <option>manager</option>
            </FormControl>
          </FormGroup>
          <FormGroup controlId="type" valid={this.validateForm('type')}>
            <OverlayTrigger key="3" placement={'right'} overlay={<Tooltip id={`tooltip-${"required"}`}> Required field </Tooltip>} >
              <FormLabel>Type of component *</FormLabel>
            </OverlayTrigger>
            <FormControl as="select" value={this.state.type} onChange={(e) => this.handleChange(e)}>
              <option default>Select type</option>
              {typeOptions.map((name,index) => (
                <option key={index}>{name}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="websocketurl">
            <FormLabel>Websocket URL</FormLabel>
            <FormControl type="text" placeholder="Enter Websocket URL" value={this.state.websocketurl} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="apiurl">
            <FormLabel>API URL</FormLabel>
            <FormControl type="text" placeholder="Enter API URL" value={this.state.apiurl} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="location">
            <FormLabel>Location</FormLabel>
            <FormControl type="text" placeholder="Enter Location" value={this.state.location} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="description">
            <FormLabel>Description</FormLabel>
            <FormControl type="text" placeholder="Enter Description" value={this.state.description} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          {this.state.managedexternally === false ?
            <FormGroup controlId="uuid" valid={this.validateForm('uuid')}>
              <FormLabel>UUID</FormLabel>
              <FormControl type="text" placeholder="Enter uuid" value={this.state.uuid}
                           onChange={(e) => this.handleChange(e)}/>
              <FormControl.Feedback/>
            </FormGroup>
            : <div/>
          }
        </form>
      </Dialog>
    );
  }
}

export default NewICDialog;

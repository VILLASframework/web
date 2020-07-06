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
import { FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import _ from 'lodash';

import Dialog from '../common/dialogs/dialog';
import ParametersEditor from '../common/parameters-editor';

class EditICDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      host: '',
      apihost: '',
      type: '',
      category: '',
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

        if (this.state.apihost != null && this.state.apihost !== "" && this.state.apihost !== "http://" && this.state.apihost !== this.props.ic.apihost) {
          data.apihost = this.state.apihost;
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


        this.props.onClose(data);
      }
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({
      name: this.props.ic.name,
      host: this.props.ic.host,
      apihost: this.props.ic.apihost,
      type: this.props.ic.type,
      category: this.props.ic.category,
      properties: _.merge({}, _.get(this.props.ic, 'rawProperties'), _.get(this.props.ic, 'properties'))
    });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit Infrastructure Component" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
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
          <FormGroup controlId="apihost">
            <FormLabel column={false}>API Host</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.apihost} value={this.state.apihost || 'http://' } onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="category">
            <FormLabel column={false}>Category (e.g. Simulator, Gateway, ...)</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.category} value={this.state.category} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="type">
            <FormLabel column={false}>Type (e.g. RTDS, VILLASnode, ...)</FormLabel>
            <FormControl type="text" placeholder={this.props.ic.type} value={this.state.type} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId='properties'>
            <FormLabel column={false}>Properties</FormLabel>
            <ParametersEditor content={this.state.properties} disabled={false} />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditICDialog;

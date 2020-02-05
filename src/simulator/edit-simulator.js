/**
 *
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

class EditSimulatorDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      endpoint: ''
    };
  }

  onClose(canceled) {
    if (canceled === false) {
      if (this.valid) {
        let data = this.props.simulator.properties;

        if (this.state.name != null && this.state.name !== "" && this.state.name !== _.get(this.props.simulator, 'rawProperties.name')) {
          data.name = this.state.name;
        }

        if (this.state.endpoint != null && this.state.endpoint !== "" && this.state.endpoint !== "http://" && this.state.endpoint !== _.get(this.props.simulator, 'rawProperties.endpoint')) {
          data.endpoint = this.state.endpoint;
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
      name: _.get(this.props.simulator, 'properties.name') || _.get(this.props.simulator, 'rawProperties.name'),
      endpoint: _.get(this.props.simulator, 'properties.endpoint') || _.get(this.props.simulator, 'rawProperties.endpoint')
    });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Edit Simulator" buttonTitle="Save" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={this.valid}>
        <form>
          <FormGroup controlId="name">
            <FormLabel column={false}>Name</FormLabel>
            <FormControl type="text" placeholder={_.get(this.props.simulator, 'properties.name')} value={this.state.name} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="endpoint">
            <FormLabel column={false}>Endpoint</FormLabel>
            <FormControl type="text" placeholder={_.get(this.props.simulator, 'properties.endpoint')} value={this.state.endpoint || 'http://' } onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId='properties'>
            <FormLabel column={false}>Properties</FormLabel>
            <ParametersEditor content={_.merge({}, _.get(this.props.simulator, 'rawProperties'), _.get(this.props.simulator, 'properties'))} disabled={true} />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default EditSimulatorDialog;

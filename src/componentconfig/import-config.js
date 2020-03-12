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

class ImportConfigDialog extends React.Component {
  imported = false;

  constructor(props) {
    super(props);

    this.state = {
      config: {}
    };
  }

  onClose(canceled){
    if (canceled) {
      this.props.onClose();

      return;
    }

    this.props.onClose(this.state.config);
  }

  resetState = () => {
    this.setState({
      config: {}
    });

    this.imported = false;
  }

  loadFile = event => {
    // get file
    const file = event.target.files[0];
    if (file.type.match('application/json') === false) {
      return;
    }

    // create file reader
    const reader = new FileReader();
    const self = this;

    reader.onload = event => {
      const config = JSON.parse(event.target.result);

      config.icID = this.props.ics.length > 0 ? this.props.ics[0]._id : null;

      self.imported = true;

      this.setState({ config: config });
    };

    reader.readAsText(file);
  }

  handleICChange = event => {
    const config = this.state.config;

    config.icID = event.target.value;

    this.setState({ config: config });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="Import Component Configuration" buttonTitle="Import" onClose={(c) => this.onClose(c)} onReset={this.resetState} valid={this.imported}>
        <form>
          <FormGroup controlId='file'>
            <FormLabel>Component Configuration File</FormLabel>
            <FormControl type='file' onChange={this.loadFile} />
          </FormGroup>

          <FormGroup controlId='IC'>
            <FormLabel>Infrastructure Component</FormLabel>
            <FormControl disabled={this.imported === false} as='select' placeholder='Select infrastructure component' value={this.state.config.icID} onChange={this.handleICChange}>
              {this.props.ics.map(ic => (
                <option key={ic.id} value={ic.id}>{_.get(ic, 'properties.name') || _.get(ic, 'rawProperties.name')}</option>
              ))}
            </FormControl>
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default ImportConfigDialog;

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

import Dialog from '../common/dialogs/dialog';

class NewResultDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        ConfigSnapshots: '',
        Description: '',
        ResultFileIDs: [],
    }
  }

  onClose(canceled) {
      console.log("on close new result");
    if (canceled === false) {
        this.props.onClose(this.state);
    } else {
      this.props.onClose();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  resetState() {
    this.setState({ 
        ConfigSnapshots: '',
        Description: '',
        ResultFileIDs: [],
     });
  }

  render() {
    return (
      <Dialog show={this.props.show} title="New Result" buttonTitle="Add" onClose={(c) => this.onClose(c)} onReset={() => this.resetState()} valid={true}>
        <form>
          <FormGroup controlId="ConfigSnapshots">
            <FormLabel>Config Snapshots</FormLabel>
            <FormControl type="text" placeholder="Enter config snapshots" value={this.state.ConfigSnapshots} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="Description">
            <FormLabel>Description</FormLabel>
            <FormControl type="text" placeholder="Enter description" value={this.state.Description} onChange={(e) => this.handleChange(e)} />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </Dialog>
    );
  }
}

export default NewResultDialog;

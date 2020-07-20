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
import {FormGroup, FormControl, FormLabel, Col} from 'react-bootstrap';

import Dialog from '../common/dialogs/dialog';

class EditFileName extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      file: {},
      
    };
  }

  onClose = canceled => {
    if (canceled) {
      if (this.props.onClose != null) {
        this.props.onClose();
      }

      return;
    }

    if (this.valid && this.props.onClose != null) {
      this.props.onClose(this.state.file);
    }
  };

  handleChange = event => {
    this.props.file.name = event.target.value;
    this.setState({file: this.props.file});

    let name = true;

    if (this.state.name === '') {
      name = false;
    }

    this.valid = name;

  };

  

  render() {
    return <Dialog show={this.props.show} title='Edit File' buttonTitle='Save' onClose={(c) => this.onClose(c)}  valid={true}>
      <form>
        <FormGroup as={Col} controlId='name'>
          <FormLabel column={false}>Name</FormLabel>
          <FormControl type='text' value={this.props.file.name} onChange={this.handleChange} />
          <FormControl.Feedback />
        </FormGroup>

      </form>
    </Dialog>;
  }
}

export default EditFileName;

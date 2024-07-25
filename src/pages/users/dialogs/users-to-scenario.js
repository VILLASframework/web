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
import { Table } from 'react-bootstrap';
import Dialog from '../../../common/dialogs/dialog';

class UsersToScenarioDialog extends React.Component {
  valid = true;

  onClose(canceled) {
    if (this.props.onClose != null) {
      this.props.onClose(canceled);
    }
  };

  renderRow(value, key) {
    return ( <tr>
      <td>{key}</td>
      <td>{value}</td>
    </tr> );
  }

  renderData() {
    let arr = [];
    this.props.users.forEach(user => {
      arr.push(this.renderRow(user.username, user.id))
    })
    return arr;
  }

  render() {
    return <Dialog
      size='md'
      show={this.props.show}
      title={'Add to \'' + this.props.scenario + '\'?'}
      buttonTitle='Confirm'
      onClose={(c) => this.onClose(c)}
      valid={true}
    >
      <Table size='sm' striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          { this.renderData() }
        </tbody>
      </Table>
    </Dialog>;
  }
}

export default UsersToScenarioDialog;

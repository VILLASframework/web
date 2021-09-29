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
import Table from '../../common/table';
import TableColumn from '../../common/table-column';
import { stateLabelStyle } from "../ics";


class ManagedICsTable extends React.Component {

  render() {

    return (<div>
      <h3>Managed ICs:</h3>
      <Table data={this.props.managedICs}>
        {this.props.currentUser.role === "Admin" ?
          <TableColumn
            title='ID'
            dataKey='id'
          />
          : <></>
        }
        <TableColumn
          title='Name'
          dataKeys={['name']}
          link='/infrastructure/'
          linkKey='id'
        />
        <TableColumn
          title='State'
          labelKey='state'
          tooltipKey='error'
          labelStyle={(state, component) => stateLabelStyle(state, component)}
        />
        <TableColumn
          title='Type'
          dataKeys={['type']}
        />
      </Table>
    </div>
    )
  }

}

export default ManagedICsTable;

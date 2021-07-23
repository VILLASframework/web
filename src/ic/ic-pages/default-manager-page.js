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
import {Col, Container, Row} from "react-bootstrap";
import IconButton from "../../common/buttons/icon-button";
import Table from '../../common/table';
import TableColumn from '../../common/table-column';
import { stateLabelStyle } from "../ics";
import { refresh, ICParamsTable } from "../ic"

class DefaultManagerPage extends React.Component {

  constructor() {
    super();

    this.state = {
      managedICs: [],
    }
  }

  static calculateState(prevState, props) {

    let sortedICs = props.ics.filter(ic => ic.category !== "manager" && parseInt(ic.manager,10) === parseInt(props.ic.uuid,10));
    return {
      managedICs: sortedICs
    }
  }

  render() {

    return (<div className='section'>


      <h1>{this.props.ic.name}
        <span className='icon-button'>

          <IconButton
            childKey={2}
            tooltip='Refresh'
            onClick={() => refresh(this.props.ic, this.props.sessionToken)}
            icon='sync-alt'
            buttonStyle={this.props.buttonStyle}
            iconStyle={this.props.iconStyle}
          />
        </span>
      </h1>

      <Container>
        <Row>
          <Col>
            {ICParamsTable(this.props.ic)}
          </Col>
          <Col>
          <h3>Managed ICs:</h3>
          <Table data={this.state.managedICs}>
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
          </Col>
        </Row>
      </Container>
      </div>
    )

  }

}

export default DefaultManagerPage;

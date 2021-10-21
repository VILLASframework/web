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
import IconButton from "../../common/buttons/icon-button";
import {Col, Container, Row} from "react-bootstrap";
import { refresh, ICParamsTable, rawDataTable } from "../ic"

class ManagerVillasRelay extends React.Component {

  constructor() {
    super();
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

        <Row>
          <Col>
            <h4>Properties</h4>
            {ICParamsTable(this.props.ic)}
          </Col>
          <Col>
            <h4>Raw Status</h4>
            {rawDataTable(this.props.ic.statusupdateraw)}
          </Col>
        </Row>
      </div>
    )
  }

}

export default ManagerVillasRelay;

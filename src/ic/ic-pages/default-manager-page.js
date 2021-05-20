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
import IconButton from "../../common/icon-button";
import Table from '../../common/table';
import TableColumn from '../../common/table-column';

class DefaultManagerPage extends React.Component {

  constructor() {
    super();

    this.state = {
      managedICs: [],
    }
  }

  componentDidMount() {
    let sortedICs = this.props.ics.filter(ic => ic.category !== "manager" && parseInt(ic.manager,10) === parseInt(this.props.ic.uuid,10));
    
    this.setState({managedICs: sortedICs});
  }

  static calculateState(prevState, props) {
  
    let sortedICs = props.ics.filter(ic => ic.category !== "manager" && parseInt(ic.manager,10) === parseInt(props.ic.uuid,10));
    return {
      managedICs: sortedICs
    }
  }

  stateLabelStyle(state, component){
    var style = [ 'badge' ];

    switch (state) {
      case 'error':
        style.push('badge-danger');
        break;
      case 'idle':
        style.push('badge-primary');
        break;
      case 'starting':
        style.push('badge-info');
        break;
      case 'running':
        style.push('badge-success');
        break;
      case 'pausing':
        style.push('badge-info');
        break;
      case 'paused':
        style.push('badge-info');
        break;
      case 'resuming':
        style.push('badge-warning');
        break;
      case 'stopping':
        style.push('badge-warning');
        break;
      case 'resetting':
        style.push('badge-warning');
        break;
      case 'shuttingdown':
        style.push('badge-warning');
        break;
      case 'shutdown':
        style.push('badge-warning');
        break;

      default:
        style.push('badge-default');

        /* Possible states of ICs
         *  'error':        ['resetting', 'error'],
         *  'idle':         ['resetting', 'error', 'idle', 'starting', 'shuttingdown'],
         *  'starting':     ['resetting', 'error', 'running'],
         *  'running':      ['resetting', 'error', 'pausing', 'stopping'],
         *  'pausing':      ['resetting', 'error', 'paused'],
         *  'paused':       ['resetting', 'error', 'resuming', 'stopping'],
         *  'resuming':     ['resetting', 'error', 'running'],
         *  'stopping':     ['resetting', 'error', 'idle'],
         *  'resetting':    ['resetting', 'error', 'idle'],
         *  'shuttingdown': ['shutdown', 'error'],
         *  'shutdown':     ['starting', 'error']
         */
    }

    return style.join(' ')
  }

  stateUpdateModifier(updatedAt, component) {
    let dateFormat = 'ddd, DD MMM YYYY HH:mm:ss ZZ';
    let dateTime = moment(updatedAt, dateFormat);
    return dateTime.fromNow()
  }

  modifyUptimeColumn(uptime, component){
    if(uptime >= 0){
      let momentDurationFormatSetup = require("moment-duration-format");
      momentDurationFormatSetup(moment)

      let timeString = moment.duration(uptime, "seconds").humanize();
      return <span>{timeString}</span>
    }
    else{
      return <Badge variant="secondary">Unknown</Badge>
    }
  }

  render() {

    return (<div className='section'>


      <h1>{this.props.ic.name}
        <span className='icon-button'>

          <IconButton
            childKey={2}
            tooltip='Refresh'
            onClick={() => this.props.refresh(this.props.ic, this.props.sessionToken)}
            icon='sync-alt'
            buttonStyle={this.props.buttonStyle}
            iconStyle={this.props.iconStyle}
          />
        </span>
      </h1>

      <Container>
        <Row>
          <Col>
            {this.props.ICParamsTable(this.props.ic)}
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
            labelStyle={(state, component) => this.stateLabelStyle(state, component)}
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

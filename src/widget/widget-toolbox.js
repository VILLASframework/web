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
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Icon from "../common/icon";

import ToolboxItem from './toolbox-item';

class WidgetToolbox extends React.Component {
  onGridChange = value => {
    // value 0 would block all widgets, set 1 as 'grid disabled'
    if (value === 0) {
      value = 1;
    }

    if (this.props.onGridChange != null) {
      this.props.onGridChange(value);
    }
  };

  render() {
    // Only one topology widget at the time is supported
    const iconStyle = {
      color: '#007bff',
      height: '25px', 
      width : '25px'
    }

    const thereIsTopologyWidget = this.props.widgets != null && Object.values(this.props.widgets).filter(w => w.type === 'Topology').length > 0;
    const topologyItemMsg = thereIsTopologyWidget? 'Currently only one is supported' : '';

    return <div className='toolbox box-header'>
      <ToolboxItem name='Lamp' type='widget' icon = 'plus' />
      <ToolboxItem name='Value' type='widget' icon = 'plus' />
      <ToolboxItem name='Plot' type='widget' icon = 'plus'/>
      <ToolboxItem name='Table' type='widget' icon = 'plus'/>
      <ToolboxItem name='Label' type='widget' icon = 'plus'/>
      <ToolboxItem name='Image' type='widget' icon = 'plus'/>
      <ToolboxItem name='Button' type='widget' icon = 'plus'/>
      <ToolboxItem name='NumberInput' type='widget' icon = 'plus'/>
      <ToolboxItem name='Slider' type='widget' icon = 'plus'/>
      <ToolboxItem name='Gauge' type='widget' icon = 'plus'/>
      <ToolboxItem name='Box' type='widget' icon = 'plus'/>
      <ToolboxItem name='HTML' type='html' icon = 'plus'/>
      <ToolboxItem name='Topology' type='widget' disabled={thereIsTopologyWidget} title={topologyItemMsg} icon = 'plus'/>
      <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"?"}`}> Drag and drop widgets onto the dashboard </Tooltip>} >   
      <Button variant="light" size="sm" key={0}  >     
          <Icon icon="question" />
      </Button>
      </OverlayTrigger>

      <div className='section-buttons-group-right'>
        <div>
          <span>Grid: { this.props.grid > 1 ? this.props.grid : 'Disabled' }</span>
          <Slider value={this.props.grid} style={{ width: '80px' }} step={5} onChange={this.onGridChange} />
          
        </div>
      </div>
      <div className='section-buttons-group-right'>
        <div>
        <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"increase"}`}> Increase dashboard height </Tooltip>} >
          <Button variant="light" key={0} style={{marginRight: '3px', height: '40px'}} onClick={() => this.props.onDashboardSizeChange(1)}  >
          <Icon icon="plus" style={iconStyle}/> 
          </Button>
          </OverlayTrigger>
          <OverlayTrigger key={1} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"decrease"}`}> Decrease dashboard height </Tooltip>} >
          <Button variant="light" key={1} style={{marginRight: '3px', height: '40px'}} onClick={() => this.props.onDashboardSizeChange(-1)} >
          <Icon icon="minus" style={iconStyle}/> 
          </Button>
          </OverlayTrigger>
        </div>
      </div>
    </div>;
  };
}

WidgetToolbox.propTypes = {
  widgets: PropTypes.array,
  grid: PropTypes.number,
  onGridChange: PropTypes.func,
  onDashboardSizeChange: PropTypes.func
};

export default WidgetToolbox;

/**
 * File: widget-toolbox.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 31.05.2018
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
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

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
    const thereIsTopologyWidget = this.props.widgets != null && Object.values(this.props.widgets).filter(w => w.type === 'Topology').length > 0;
    const topologyItemMsg = thereIsTopologyWidget? 'Currently only one is supported' : '';

    return <div className='toolbox box-header'>
      <ToolboxItem name='Lamp' type='widget' />
      <ToolboxItem name='Value' type='widget' />
      <ToolboxItem name='Plot' type='widget' />
      <ToolboxItem name='Table' type='widget' />
      <ToolboxItem name='Label' type='widget' />
      <ToolboxItem name='Image' type='widget' />
      <ToolboxItem name='PlotTable' type='widget' />
      <ToolboxItem name='Button' type='widget' />
      <ToolboxItem name='NumberInput' type='widget' />
      <ToolboxItem name='Slider' type='widget' />
      <ToolboxItem name='Gauge' type='widget' />
      <ToolboxItem name='Box' type='widget' />
      <ToolboxItem name='HTML' type='html' />
      <ToolboxItem name='Topology' type='widget' disabled={thereIsTopologyWidget} title={topologyItemMsg}/>

      <div className='section-buttons-group-right'>
        <div>
          <span>Grid: { this.props.grid > 1 ? this.props.grid : 'Disabled' }</span>
          <Slider value={this.props.grid} style={{ width: '80px' }} step={5} onChange={this.onGridChange} />
        </div>
      </div>
    </div>;
  };
}

WidgetToolbox.propTypes = {
  widgets: PropTypes.array,
  grid: PropTypes.number,
  onGridChange: PropTypes.func
};

export default WidgetToolbox;

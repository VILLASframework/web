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
import { Collapse } from 'react-collapse';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Icon from "../common/icon";
import ToolboxItem from './toolbox-item';

class WidgetToolbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        showCosmeticWidgets: false,
        showDisplayingWidgets: false,
        showManipulationWidgets: false
    };
}
  onGridChange = value => {
    // value 0 would block all widgets, set 1 as 'grid disabled'
    if (value === 0) {
      value = 1;
    }

    if (this.props.onGridChange != null) {
      this.props.onGridChange(value);
    }
  };

  disableDecrease(){
    const maxHeight = Object.values(this.props.widgets).reduce((currentHeight, widget) => {
      const absolutHeight = widget.y + widget.height;

      return absolutHeight > currentHeight ? absolutHeight : currentHeight;
      }, 0);

      if(this.props.dashboard.height <= 400 || this.props.dashboard.height <= maxHeight + 80){
        return true;
      }

      return false;
  }

  showWidgets(value){
    let tempValue = false;
    switch(value){
      case 'cosmetic':
        tempValue = !this.state.showCosmeticWidgets;
        this.setState({showCosmeticWidgets: tempValue});
        break;
      case 'displaying':
        tempValue = !this.state.showDisplayingWidgets;
        this.setState({showDisplayingWidgets: tempValue});
        break;
      case 'manipulation':
        tempValue = !this.state.showManipulationWidgets;
        this.setState({showManipulationWidgets: tempValue});
        break;
      default:
        break;
    }
  }

  render() {
    let cosmeticIcon = 'chevron-up';
    let displayingIcon = 'chevron-up';
    let manipulationIcon = 'chevron-up';
    if(this.state.showCosmeticWidgets){
      cosmeticIcon = 'chevron-down';
    }
    if(this.state.showDisplayingWidgets){
      displayingIcon = 'chevron-down';
    }
    if(this.state.showManipulationWidgets){
      manipulationIcon = 'chevron-down';
    }

    const disableDecrease = this.disableDecrease();
    // Only one topology widget at the time is supported
    const iconStyle = {
      height: '25px',
      width : '25px'
    }

    const buttonStyle = {
      marginRight: '3px',
      height: '40px',
    }

    const thereIsTopologyWidget = this.props.widgets != null && Object.values(this.props.widgets).filter(w => w.type === 'Topology').length > 0;
    const topologyItemMsg = thereIsTopologyWidget? 'Currently only one is supported' : '';

    return (

    <div className='toolbox box-header'>
<div className='section-buttons-group-left'>
        <div>
        <OverlayTrigger key={2} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"cosmetic"}`}> Show/ hide available Cosmetic Widgets </Tooltip>} >
        <Button key={2} variant="secondary" style={buttonStyle} onClick={() => this.showWidgets('cosmetic')}  >
          <Icon icon={cosmeticIcon}/> Cosmetic Widgets</Button>
      </OverlayTrigger>
      <OverlayTrigger key={3} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"displaying"}`}> Show/ hide available Displaying Widgets </Tooltip>} >
        <Button key={3} variant="secondary"  style={buttonStyle} onClick={() => this.showWidgets('displaying')}  >
          <Icon icon={displayingIcon}/> Displaying Widgets</Button>
      </OverlayTrigger>
      <OverlayTrigger key={4} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"manipulation"}`}> Show/ hide available Manipulation Widgets </Tooltip>} >
        <Button key={2} variant="secondary" style={buttonStyle} onClick={() => this.showWidgets('manipulation')}  >
          <Icon icon={manipulationIcon}/> Manipulation Widgets</Button>
      </OverlayTrigger>
        </div>
      </div>
      <div className='section-buttons-group-right'>
        <div>
          <span>Grid: { this.props.grid > 1 ? this.props.grid : 'Disabled' }</span>
          <Slider value={this.props.grid} style={{ width: '80px' }} step={5} onChange={this.onGridChange} />
          <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"increase"}`}> Increase dashboard height </Tooltip>} >
          <Button variant="light" key={0} style={buttonStyle} onClick={() => this.props.onDashboardSizeChange(1)}  >
          <Icon icon="plus" classname='icon-color' style={iconStyle}/>
          </Button>
          </OverlayTrigger>
          <OverlayTrigger key={1} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"decrease"}`}> Decrease dashboard height </Tooltip>} >
          <Button variant="light" key={1} disabled={disableDecrease} style={buttonStyle} onClick={() => this.props.onDashboardSizeChange(-1)} >
          <Icon icon="minus" classname='icon-color' style={iconStyle}/>
          </Button>
          </OverlayTrigger>

        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className= 'drag-and-drop'>
      <span>
      <Collapse isOpened={this.state.showCosmeticWidgets} >
      <ToolboxItem name='Line' type='widget' icon='plus'/>
      <ToolboxItem name='Box' type='widget' icon = 'plus'/>
      <ToolboxItem name='Label' type='widget' icon = 'plus'/>
      <ToolboxItem name='Image' type='widget' icon = 'plus'/>
      <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"?"}`}> Drag and drop widgets onto the dashboard </Tooltip>} >
      <Button disabled={true} variant="light" size="sm" key={0}  >
          <Icon icon="question" />
      </Button>
      </OverlayTrigger>
      </Collapse>

      <Collapse isOpened={this.state.showDisplayingWidgets} >
      <ToolboxItem name='Plot' type='widget' icon = 'plus'/>
      <ToolboxItem name='Table' type='widget' icon = 'plus'/>
      <ToolboxItem name='Value' type='widget' icon = 'plus' />
      <ToolboxItem name='Lamp' type='widget' icon = 'plus' />
      <ToolboxItem name='Gauge' type='widget' icon = 'plus'/>
      <ToolboxItem name='Topology' type='widget' disabled={thereIsTopologyWidget} title={topologyItemMsg} icon = 'plus'/>
      <ToolboxItem name='TimeOffset' type='widget' icon = 'plus' />
      <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"?"}`}> Drag and drop widgets onto the dashboard </Tooltip>} >
      <Button disabled={true} variant="light" size="sm" key={0}  >
          <Icon icon="question" />
      </Button>
      </OverlayTrigger>
      </Collapse>

      <Collapse isOpened={this.state.showManipulationWidgets} >
      <ToolboxItem name='Button' type='widget' icon = 'plus'/>
      <ToolboxItem name='NumberInput' type='widget' icon = 'plus'/>
      <ToolboxItem name='Slider' type='widget' icon = 'plus'/>
      <OverlayTrigger key={0} placement={'bottom'} overlay={<Tooltip id={`tooltip-${"?"}`}> Drag and drop widgets onto the dashboard </Tooltip>} >
      <Button disabled={true} variant="light" size="sm" key={0}  >
          <Icon icon="question" />
      </Button>
      </OverlayTrigger>
      </Collapse>
      </span>
      </div>



    </div>
    )
  };
}

WidgetToolbox.propTypes = {
  widgets: PropTypes.array,
  grid: PropTypes.number,
  onGridChange: PropTypes.func,
  onDashboardSizeChange: PropTypes.func
};

export default WidgetToolbox;

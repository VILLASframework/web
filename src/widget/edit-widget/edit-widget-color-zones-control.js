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
import { Form, Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ColorPicker from '../../common/color-picker'
import Icon from '../../common/icon';
import { Collapse } from 'react-collapse';

class EditWidgetColorZonesControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colorZones: [],
      selectedIndex: null,
      showColorPicker: false,
      originalColor: null,
      minValue: 0,
      maxValue: 100
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      colorZones: props.widget.customProperties.zones
    };
  }

  addZone = () => {
    // add row
    const zones = JSON.parse(JSON.stringify(this.state.colorZones));
    zones.push({ strokeStyle: '#d3cbcb', min: 0, max: 100 });

    if(zones.length > 0){
      let length = zones.length

      for(let i= 0 ; i < length; i++){
        zones[i].min = i* 100/length;
        zones[i].max = (i+1)* 100/length;
      }
    }

    this.setState({ colorZones: zones, selectedIndex: null });
    this.props.handleChange({target: { id: this.props.controlId, value: zones}})
  }

  removeZones = () => {
    let zones = JSON.parse(JSON.stringify(this.state.colorZones));
    zones.splice(this.state.selectedIndex, 1);
    if(zones.length > 0){
      let length = zones.length
      for(let i= 0 ; i < length; i++){
        zones[i].min = i* 100/length;
        zones[i].max = (i+1)* 100/length;
      }
    }
    this.setState({colorZones: zones, selectedIndex: null});
    this.props.handleChange({target: { id: this.props.controlId, value: zones}})
  }

  changeCell = (event, row, column) => {
    // change row
    const zones = JSON.parse(JSON.stringify(this.state.colorZones))

    if (column === 1) {
      zones[row].strokeStyle = event.target.value;
    } else if (column === 2) {
      zones[row].min = event.target.value;
    } else if (column === 3) {
      zones[row].max = event.target.value;
    }

    this.setState({ colorZones: zones });
    this.props.handleChange({target: { id: this.props.controlId, value: zones}})
  }

  editColorZone = (index) => {
    if(this.state.selectedIndex !== index){
      this.setState({
        selectedIndex: index ,
        minValue: this.state.colorZones[index].min,
        maxValue: this.state.colorZones[index].max}
      );
    }
    else{
      this.setState({selectedIndex: null});
    }
  }

  openColorPicker = () => {
    let color = this.state.colorZones[this.state.selectedIndex].strokeStyle;
    this.setState({showColorPicker: true, originalColor: color});
  }

  closeColorPickerEditModal = (data) => {
    this.setState({showColorPicker: false})
    let zones = JSON.parse(JSON.stringify(this.state.colorZones))
    if(typeof data === 'undefined'){

      zones[this.state.selectedIndex].strokeStyle = this.state.originalColor
      this.setState({ colorZones : zones });
    } else {
      // color picker with result data {hexcolor, opacity}
      zones[this.state.selectedIndex].strokeStyle = data.hexcolor
      this.setState({ colorZones : zones });
      this.props.handleChange({target: { id: this.props.controlId, value: zones}})
    }
  }

  handleMinChange = (e) => {

    if(e.target.value < 0) return;
    this.setState({minValue: e.target.value});

    let zones = JSON.parse(JSON.stringify(this.state.colorZones));
    zones[this.state.selectedIndex]['min'] = e.target.value;

    if(this.state.selectedIndex !== 0){
      zones[this.state.selectedIndex - 1]['max'] = e.target.value
    }

    this.setState({ colorZones: zones });
    this.props.handleChange({target: { id: this.props.controlId, value: zones}})
   }

  handleMaxChange = (e) => {

    if(e.target.value > 100) return;
    this.setState({maxValue: e.target.value});

    let zones = JSON.parse(JSON.stringify(this.state.colorZones));
    zones[this.state.selectedIndex]['max'] = e.target.value;

    if(this.state.selectedIndex !== zones.length -1){
      zones[this.state.selectedIndex + 1]['min'] = e.target.value
    }

    this.setState({ colorZones: zones });
    this.props.handleChange({target: { id: this.props.controlId, value: zones}})
  }


  render() {
    const buttonStyle = {
      marginBottom: '10px',
      marginLeft: '120px',
    };

    const iconStyle = {
      height: '25px',
      width : '25px'
    }

    let tempColor = 'FFFFFF';
    let collapse = false;
    if(this.state.selectedIndex !== null){
      collapse = true;
      tempColor = this.state.colorZones[this.state.selectedIndex].strokeStyle;
    }

    let pickerStyle = {
      backgroundColor: tempColor,
      width: '260px',
      height: '40px',
      marginTop: '20px'
    }

    return <Form.Group style={this.props.style}>
      <Form.Label>Color Zones</Form.Label>
      <span className='icon-button'>
        <Button
          variant='light'
          onClick={this.addZone}
          style={buttonStyle}
          disabled={!this.props.widget.customProperties.colorZones}
        >
          <Icon icon="plus" className='icon-color' style={iconStyle} />
        </Button>
      </span>
    <div>
      {
        this.state.colorZones.map((zone, idx) => {
          let color = zone.strokeStyle;
          let width = (zone.max - zone.min)*(260/100);
          let style = {
            backgroundColor: color,
            width: width,
            height: '40px'
          }
          return (
            <span>
              <OverlayTrigger key={idx} placement={'right'} overlay={<Tooltip id={`tooltip-${"color-edit"}`}>Edit zone</Tooltip>} >
              <span>
              <Button
              style={style}
              key={idx}
              onClick={i => this.editColorZone(idx)}
              disabled={!this.props.widget.customProperties.colorZones}>
                <Icon icon="pen" />
              </Button>
              </span>
              </OverlayTrigger>
            </span>
          )
        })
      }
    </div>
      <Collapse isOpened={collapse}>
        <Form.Label>Edit selected color zone:</Form.Label>
        <OverlayTrigger key={0} placement={'right'} overlay={<Tooltip id={`tooltip-${"color"}`}>Change color</Tooltip>} >
          <Button key={0} style={pickerStyle} onClick={this.openColorPicker.bind(this)}  >
            <Icon icon="paint-brush"/>
          </Button>
          </OverlayTrigger>
          <Table>
          <tbody>
            <tr>
              <td>
                Min:
                <Form.Control
                  type="number"
                  step="any"
                  placeholder="Min"
                  value={this.state.minValue}
                  onChange={e => this.handleMinChange(e)} />
              </td>
              <td>
                Max:
                <Form.Control
                  type="number"
                  step="any"
                  placeholder="Max"
                  value={ this.state.maxValue}
                  onChange={e => this.handleMaxChange(e)} />
              </td>
            </tr>
          </tbody>
        </Table>
        <span className='icon-button'>
          <OverlayTrigger key={1} placement={'right'} overlay={<Tooltip id={`tooltip-${"color-delete"}`}>Remove zone</Tooltip>} >
            <Button
              variant='light'
              onClick={this.removeZones} >
              <Icon style={iconStyle} classname='icon-color' icon="trash-alt" />
            </Button>
          </OverlayTrigger>
        </span>
      </Collapse>
      <ColorPicker
        show={this.state.showColorPicker}
        onClose={(data) => this.closeColorPickerEditModal(data)}
        hexcolor={tempColor}
        opacity={1}
        disableOpacity={this.props.disableOpacity}
      />
    </Form.Group>;
  }
}

export default EditWidgetColorZonesControl;

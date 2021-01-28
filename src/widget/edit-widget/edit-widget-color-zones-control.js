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
import { FormGroup, FormControl, Table, FormLabel, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ColorPicker from './color-picker'

import Icon from '../../common/icon';
import {Collapse} from 'react-collapse';

class EditWidgetColorZonesControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      widget: {
        customProperties:{
        zones: []
        }
      },
      selectedZone: null,
      selectedIndex: null,
      showColorPicker: false,
      originalColor: null,
      minValue: 0,
      maxValue: 100
    };
  }

  static getDerivedStateFromProps(props, state){
    return {
      widget: props.widget
    };
  }

  addZone = () => {
    // add row
    const widget = this.state.widget;
    widget.customProperties.zones.push({ strokeStyle: '#d3cbcb', min: 0, max: 100 });
    
    if(widget.customProperties.zones.length > 0){      
    let length = widget.customProperties.zones.length

    for(let i= 0 ; i < length; i++){
    widget.customProperties.zones[i].min = i* 100/length;
    widget.customProperties.zones[i].max = (i+1)* 100/length;
    }
    }

    this.setState({ widget, selectedZone: null, selectedIndex: null });

    this.sendEvent(widget);
  }

  removeZones = () => {
    
    let temp = this.state.widget;

    temp.customProperties.zones.splice(this.state.selectedIndex, 1);

    if(temp.customProperties.zones.length > 0){      
      let length = temp.customProperties.zones.length
  
      for(let i= 0 ; i < length; i++){
      temp.customProperties.zones[i].min = i* 100/length;
      temp.customProperties.zones[i].max = (i+1)* 100/length;
      }
      }

    this.setState({widget: temp,selectedZone: null, selectedIndex: null});

  }

  changeCell = (event, row, column) => {
    // change row
    const widget = this.state.widget;

    if (column === 1) {
      widget.customProperties.zones[row].strokeStyle = event.target.value;
    } else if (column === 2) {
      widget.customProperties.zones[row].min = event.target.value;
    } else if (column === 3) {
      widget.customProperties.zones[row].max = event.target.value;
    }

    this.setState({ widget });

    this.sendEvent(widget);
  }

  editColorZone = (index) => {
    if(this.state.selectedIndex !== index){
    this.setState({selectedZone: this.state.widget.customProperties.zones[index], selectedIndex: index , minValue: this.state.widget.customProperties.zones[index].min, maxValue: this.state.widget.customProperties.zones[index].max});
    }
    else{
      this.setState({selectedZone: null, selectedIndex: null});
    }
  }

  openColorPicker = () =>{
    
    let color = this.state.selectedZone.strokeStyle;

    this.setState({showColorPicker: true, originalColor: color});
  }

  closeEditModal = (data) => {
    this.setState({showColorPicker: false})
    if(typeof data === 'undefined'){

      let temp = this.state.selectedZone;
      temp.strokeStyle = this.state.originalColor;
      
      this.setState({ selectedZone : temp });
    }
  }

  handleMinChange = (e) => {

    if(e.target.value < 0) return;
    this.setState({minValue: e.target.value});

    let temp = this.state.widget;
    temp.customProperties.zones[this.state.selectedIndex]['min'] = e.target.value;

    if(this.state.selectedIndex !== 0){
      temp.customProperties.zones[this.state.selectedIndex - 1]['max'] = e.target.value
    }

    this.setState({ widget: temp });
   }

  handleMaxChange = (e) => {

    if(e.target.value > 100) return;
    this.setState({maxValue: e.target.value});

    let temp = this.state.widget;
    temp.customProperties.zones[this.state.selectedIndex]['max'] = e.target.value;

    if(this.state.selectedIndex !== this.state.widget.customProperties.zones.length -1){
      temp.customProperties.zones[this.state.selectedIndex + 1]['min'] = e.target.value
    }
    
    this.setState({ widget: temp });
    }

  sendEvent(widget) {
    // create event
    const event = {
      target: {
        id: 'zones',
        value: widget.customProperties.zones
      }
    };

    this.props.handleChange(event);
  }

  

  render() {


    let tempColor = 'FFFFFF';
    let collapse = false;
    if(this.state.selectedZone !== null){
      collapse = true;
      tempColor = this.state.selectedZone.strokeStyle;
    }

    let pickerStyle = {
      backgroundColor: tempColor,
      width: '260px', 
      height: '40px',
      marginTop: '20px'
    }
    
    return <FormGroup>
      <FormLabel>Color Zones</FormLabel>
      <Button  onClick={this.addZone} style={{marginBottom: '10px', marginLeft: '120px'}} disabled={!this.props.widget.customProperties.colorZones}><Icon size='xs' icon="plus" /></Button>

    <div>
      {
          this.state.widget.customProperties.zones.map((zone, idx) => {
            let color = zone.strokeStyle;
            let width = (zone.max - zone.min)*(260/100);
            let style = {
              backgroundColor: color,
              width: width,
              height: '40px'
            }
            
            return (<Button
              style={style} key={idx} onClick={i => this.editColorZone(idx)} disabled={!this.props.widget.customProperties.colorZones}><Icon icon="pen" /></Button>
            )
          }
          )

      }
      </div>
      <Collapse isOpened={collapse} >
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
              <FormControl
                type="number"
                step="any"
                placeholder="Min"
                value={this.state.minValue}
                onChange={e => this.handleMinChange(e)} />
            </td>
            <td>
              Max:
              <FormControl
                type="number"
                step="any"
                placeholder="Max"
                value={ this.state.maxValue}
                onChange={e => this.handleMaxChange(e)} />
            </td>
          </tr>
        </tbody>
      </Table>
      <Button  onClick={this.removeZones}><Icon size='xs' icon="trash-alt" /></Button>
      </Collapse>
      
      <ColorPicker show={this.state.showColorPicker} onClose={(data) => this.closeEditModal(data)} widget={this.state.widget} zoneIndex={this.state.selectedIndex} controlId={'strokeStyle'} />
    </FormGroup>;
  }
}

export default EditWidgetColorZonesControl;

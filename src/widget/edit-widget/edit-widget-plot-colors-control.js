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

import React, { Component } from 'react';
import { OverlayTrigger, Tooltip , Button, Form } from 'react-bootstrap';
import ColorPicker from '../../common/color-picker'
import Icon from "../../common/icon";
import {schemeCategory10} from "d3-scale-chromatic";

class EditWidgetPlotColorsControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showColorPicker: false,
      originalColor: null,
      selectedIndex: null,
      lineColors: [],
      signalIDs: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      lineColors: props.widget.customProperties.lineColors,
      signalIDs: props.widget.signalIDs,
    };
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

    let lineColorsChanged = false;

    if (JSON.stringify(this.state.signalIDs) !== JSON.stringify(prevState.signalIDs)){
      // if there was a change to the signal IDs
      let tempLineColors = JSON.parse(JSON.stringify(this.state.lineColors));
      let oldNoSignals = tempLineColors.length

      if (this.state.signalIDs.length > prevState.signalIDs.length){
        // more signals than before
        let diff = this.state.signalIDs.length - prevState.signalIDs.length
        for (let i = 0; i<diff; i++){
          tempLineColors.push(schemeCategory10[oldNoSignals+i % 10])
          lineColorsChanged = true;
        }

      } else if (this.state.signalIDs.length < prevState.signalIDs.length){
        // less signals than before
        let diff = prevState.signalIDs.length - this.state.signalIDs.length
        for (let i = 0; i<diff; i++){
          tempLineColors.pop()
          lineColorsChanged = true;
        }
      }

      this.setState({lineColors: tempLineColors})
      if (lineColorsChanged){
        this.props.handleChange({target: { id: this.props.controlId, value: tempLineColors} })
      }

    }
  }

  closeColorPickerEditModal = (data) => {
    this.setState({showColorPicker: false})
    let tempLineColors = JSON.parse(JSON.stringify(this.state.lineColors));
    if(typeof data === 'undefined'){
      // Color picker canceled
      tempLineColors[this.state.selectedIndex] = this.state.originalColor;
      this.setState({lineColors: tempLineColors})
    } else {
      // color picker with result data {hexcolor, opacity}
      tempLineColors[this.state.selectedIndex] = data.hexcolor
      this.setState({lineColors: tempLineColors})
      this.props.handleChange({target: { id: this.props.controlId, value: tempLineColors} })
    }
  }

  editLineColor = (index) => {
    if(this.state.selectedIndex !== index){
      let color = typeof this.state.lineColors[index] === "undefined" ? schemeCategory10[index % 10] : this.state.lineColors[index];
      this.setState({selectedIndex: index, showColorPicker: true, originalColor: color});
    }
    else{
      this.setState({selectedIndex: null});
    }
  }

  render() {

    return (
      <Form.Group style={this.props.style}>
        <Form.Label>Line Colors</Form.Label>
          <div>
              {
                this.props.widget.signalIDs.map((signalID, idx) => {

                  let color = typeof this.state.lineColors[idx] === "undefined" ? schemeCategory10[idx % 10] : this.state.lineColors[idx];
                  let width = 260 / this.props.widget.signalIDs.length;
                  let style = {
                      backgroundColor: color,
                      width: width,
                      height: '40px'
                  }
                  let signal = this.props.signals.find(signal => signal.id === signalID);

                  return <OverlayTrigger
                    key={idx}
                    placement={'bottom'}
                    overlay={<Tooltip id={'tooltip-${"signal name"}'}>{signal.name}</Tooltip>}
                  >
                    <Button
                      style={style}
                      key={idx}
                      onClick={i => this.editLineColor(idx)}
                    >
                      <Icon icon="pen" />
                    </Button>

                  </OverlayTrigger>;
                })
              }
            </div>

        <ColorPicker
          show={this.state.showColorPicker}
          onClose={(data) => this.closeColorPickerEditModal(data)}
          hexcolor={this.state.lineColors[this.state.selectedIndex]}
          opacity={1}
          disableOpacity={true}
        />
      </Form.Group>

    )
  }
}

export default EditWidgetPlotColorsControl;

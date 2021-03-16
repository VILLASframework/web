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
import ColorPicker from './color-picker'
import Icon from "../../common/icon";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

// schemeCategory20 no longer available in d3

class EditWidgetPlotColorsControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      widget: {},
      showColorPicker: false,
      originalColor: null,
      selectedIndex: null
    };
  }

  static getDerivedStateFromProps(props, state){

    let widget = props.widget;
    if(widget.customProperties.lineColors === undefined || widget.customProperties.lineColors === null){
      // for backwards compatibility with old plots
      widget.customProperties.lineColors = []

      const newLineColor = scaleOrdinal(schemeCategory10);
      for (let signalID of widget.signalIDs){
        widget.customProperties.lineColors.push(newLineColor(signalID))
      }
    }

    return {
      widget: widget
    };
  }

//same here

  closeEditModal = (data) => {
    this.setState({showColorPicker: false})
    if(typeof data === 'undefined'){

      let temp = this.state.widget;
      temp.customProperties.lineColors[this.state.selectedIndex] = this.state.originalColor;
      this.setState({ widget: temp });
    }
  }

  editLineColor = (index) => {
    if(this.state.selectedIndex !== index){
        let color = this.state.widget.customProperties.lineColors[index];
        this.setState({selectedIndex: index, showColorPicker: true, originalColor: color});
        }
        else{
          this.setState({selectedIndex: null});
        }
  }

  render() {

    return (
      <Form.Group>
        <Form.Label>Line Colors</Form.Label>
          <div>
              {
                this.state.widget.signalIDs.map((signalID, idx) => {
                  let color = this.state.widget.customProperties.lineColors[signalID];
                  let width = 260 / this.state.widget.signalIDs.length;
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
                      onClick={i => this.editLineColor(signalID)}
                    >
                      <Icon icon="pen" />
                    </Button>
                  </OverlayTrigger>;
                })
              }
            </div>

        <ColorPicker show={this.state.showColorPicker} onClose={(data) => this.closeEditModal(data)} widget={this.state.widget} lineIndex={this.state.selectedIndex} controlId={'lineColor'} disableOpacity={true}/>
      </Form.Group>

    )
  }
}

export default EditWidgetPlotColorsControl;

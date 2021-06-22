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
import { Form, Container, Row, Col, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';
import ColorPicker from '../../common/color-picker'
import Icon from "../../common/icon";

// schemeCategory20 no longer available in d3

class EditWidgetColorControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      color: null,
      opacity: null,
      showColorPicker: false,
      originalColor: null
    };
  }

  static getDerivedStateFromProps(props, state){
    let parts = props.controlId.split('.');
    let isCustomProperty = true;
    if (parts.length === 1){
      isCustomProperty = false;
    }

    let color = (isCustomProperty ? props.widget[parts[0]][parts[1]] : props.widget[props.controlId]);
    let opacity = (isCustomProperty ? props.widget[parts[0]][parts[1] + "_opacity"] : props.widget[props.controlId + "_opacity"]);

    return {
      color: color,
      opacity: opacity,
    };
  }

  openColorPicker = () =>{
    this.setState({showColorPicker: true, originalColor: this.state.color});
  }

  closeColorPickerEditModal = (data) => {
    this.setState({showColorPicker: false})

    if(typeof data === 'undefined'){

      this.setState({ color: this.state.originalColor });
    } else {
      // color picker with result data {hexcolor, opacity}
      this.setState({color: data.hexcolor, opacity: data.opacity})
      this.props.handleChange({target: { id: this.props.controlId, value: data.hexcolor} })
      this.props.handleChange({target: { id: this.props.controlId + "_opacity", value: data.opacity} })
    }
  }

  render() {
    let style = {
      backgroundColor: this.state.color,
      opacity: this.state.opacity,
      width: '80px',
      height: '40px',
    }

    let tooltipText = "Change color and opacity";
    if(this.props.disableOpacity){
      tooltipText = "Change border color";
    }
    return ( <Container>
    <Row>
      <Col>
        <Form.Label>{this.props.label}</Form.Label>
      </Col>

      <Col>
        <div className='section-buttons-group-right'>
          <OverlayTrigger key={0} placement={'right'} overlay={<Tooltip id={`tooltip-${"color"}`}> {tooltipText} </Tooltip>} >
          <Button style={style} onClick={this.openColorPicker.bind(this)}  >
            <Icon icon="paint-brush"/>
          </Button>
          </OverlayTrigger>
        </div>
        <ColorPicker
          show={this.state.showColorPicker}
          onClose={(data) => this.closeColorPickerEditModal(data)}
          hexcolor={this.state.color}
          opacity={this.state.opacity}
          disableOpacity={this.props.disableOpacity}
        />
      </Col>
      </Row>
    </Container>
  );
  }
}

export default EditWidgetColorControl;

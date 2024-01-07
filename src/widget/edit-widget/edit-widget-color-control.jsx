import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';
import ColorPicker from '../../common/color-picker';
import Icon from "../../common/icon";

const EditWidgetColorControl = (props) => {
  const [color, setColor] = useState(null);
  const [opacity, setOpacity] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [originalColor, setOriginalColor] = useState(null);

  useEffect(() => {
    const parts = props.controlId.split('.');
    const isCustomProperty = parts.length !== 1;
    const newColor = isCustomProperty ?
      props.widget[parts[0]][parts[1]] :
      props.widget[props.controlId];
    const newOpacity = isCustomProperty ?
      props.widget[parts[0]][parts[1] + "_opacity"] :
      props.widget[props.controlId + "_opacity"];

    setColor(newColor);
    setOpacity(newOpacity);
  }, [props.controlId, props.widget]);

  const openColorPicker = () => {
    setShowColorPicker(true);
    setOriginalColor(color);
  };

  const closeColorPickerEditModal = (data) => {
    setShowColorPicker(false);

    if (data === undefined) {
      setColor(originalColor);
    } else {
      setColor(data.hexcolor);
      setOpacity(data.opacity);
      props.handleChange({ target: { id: props.controlId, value: data.hexcolor } });
      props.handleChange({ target: { id: props.controlId + "_opacity", value: data.opacity } });
    }
  };

  const style = {
    backgroundColor: color,
    opacity: opacity,
    width: '80px',
    height: '40px',
  };

  const tooltipText = props.disableOpacity ? "Change border color" : "Change color and opacity";

  return (
    <Container style={props.style}>
      <Row>
        <Col>
          <Form.Label>{props.label}</Form.Label>
        </Col>

        <Col>
          <div className='section-buttons-group-right'>
            <OverlayTrigger
              key={0}
              placement={'right'}
              overlay={
                <Tooltip id={`tooltip-${"color"}`}>
                  {tooltipText}
                </Tooltip>
              }
            >
              <Button style={style} onClick={openColorPicker}>
                <Icon icon="paint-brush" />
              </Button>
            </OverlayTrigger>
          </div>
          <ColorPicker
            show={showColorPicker}
            onClose={closeColorPickerEditModal}
            hexcolor={color}
            opacity={opacity}
            disableOpacity={props.disableOpacity}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EditWidgetColorControl;
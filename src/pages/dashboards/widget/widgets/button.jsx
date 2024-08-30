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

import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const WidgetButton = (props) => {
  const [pressed, setPressed] = useState(props.widget.customProperties.pressed);

  useEffect(() => {
    let widget = props.widget;
    widget.customProperties.simStartedSendValue = false;
    widget.customProperties.pressed = false;

    // AppDispatcher.dispatch({
    //   type: 'widgets/start-edit',
    //   token: props.token,
    //   data: widget
    // });

    // Effect cleanup
    return () => {
      // Clean up if needed
    };
  }, [props.token, props.widget]);

  useEffect(() => {
    if (props.widget.customProperties.simStartedSendValue) {
      let widget = props.widget;
      widget.customProperties.simStartedSendValue = false;
      widget.customProperties.pressed = false;
      AppDispatcher.dispatch({
        type: 'widgets/start-edit',
        token: props.token,
        data: widget
      });

      props.onInputChanged(widget.customProperties.off_value, '', false, false);
    }
  }, [props, setPressed]);

  useEffect(() => {
    setPressed(props.widget.customProperties.pressed);
  }, [props.widget.customProperties.pressed]);

  const onPress = (e) => {
    if (e.button === 0 && !props.widget.customProperties.toggle) {
      valueChanged(props.widget.customProperties.on_value, true);
    }
  };

  const onRelease = (e) => {
    if (e.button === 0) {
      let nextState = false;
      if (props.widget.customProperties.toggle) {
        nextState = !pressed;
      }
      valueChanged(nextState ? props.widget.customProperties.on_value : props.widget.customProperties.off_value, nextState);
    }
  };

  const valueChanged = (newValue, newPressed) => {
    if (props.onInputChanged) {
      props.onInputChanged(newValue, 'pressed', newPressed, true);
    }
    setPressed(newPressed);
  };

  let opacity = props.widget.customProperties.background_color_opacity;
  const buttonStyle = {
    backgroundColor: props.widget.customProperties.background_color,
    borderColor: props.widget.customProperties.border_color,
    color: props.widget.customProperties.font_color,
    opacity: pressed ? (opacity + 1) / 4 : opacity,
  };

  return (
    <div className="button-widget full">
      <Button
        className="full"
        style={buttonStyle}
        active={pressed}
        disabled={props.editing}
        onMouseDown={(e) => onPress(e)}
        onMouseUp={(e) => onRelease(e)}
      >
        {props.widget.name}
      </Button>
    </div>
  );
};

export default WidgetButton;

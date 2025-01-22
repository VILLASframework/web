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

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useUpdateWidgetMutation } from "../../../../store/apiSlice";

const WidgetButton = ({ widget, editing }) => {
  const [pressed, setPressed] = useState(widget.customProperties.pressed);
  const [updateWidget] = useUpdateWidgetMutation();

  useEffect(() => {
    updateSimStartedAndPressedValues(false, false);
  }, [widget]);

  const updateSimStartedAndPressedValues = async (isSimStarted, isPressed) => {
    try {
      await updateWidget({
        widgetID: widget.id,
        updatedWidget: {
          widget: {
            ...widget,
            customProperties: {
              ...widget.customProperties,
              simStartedSendValue: isSimStarted,
              pressed: isPressed,
            },
          },
        },
      }).unwrap();
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    if (widget.customProperties.simStartedSendValue) {
      let widget = widget;
      widget.customProperties.simStartedSendValue = false;
      widget.customProperties.pressed = false;

      onInputChanged(widget.customProperties.off_value, "", false, false);
    }
  }, [pressed]);

  useEffect(() => {
    setPressed(widget.customProperties.pressed);
  }, [widget.customProperties.pressed]);

  let opacity = widget.customProperties.background_color_opacity;
  const buttonStyle = {
    backgroundColor: widget.customProperties.background_color,
    borderColor: widget.customProperties.border_color,
    color: widget.customProperties.font_color,
    opacity: pressed ? (opacity + 1) / 4 : opacity,
  };

  return (
    <div className="button-widget full">
      <Button
        className="full"
        style={buttonStyle}
        active={pressed}
        disabled={editing}
        onMouseDown={(e) => setPressed(true)}
        onMouseUp={(e) => setPressed(false)}
      >
        {widget.name}
      </Button>
    </div>
  );
};

export default WidgetButton;

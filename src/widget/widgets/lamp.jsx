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

const WidgetLamp = (props) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if(props.widget.signalIDs.length === 0){
      setValue('');
      return;
    }

    let signalID = props.widget.signalIDs[0];
    let signal = props.signals.find(s => s.id === signalID);
    
    if(signal) {
      let icID = props.icIDs[signal.id];
      
      if (!(props.data &&
            props.data[icID] &&
            props.data[icID].output &&
            props.data[icID].output.values)) {
        setValue('');
        return;
      }
      
      const data = props.data[icID].output.values[signal.index];
      if(data) {
        const newValue = String(signal.scalingFactor * data[data.length - 1].y);
        if (value !== newValue) {
          setValue(newValue);
        }
      }
    }
  }, [props.widget.signalIDs, props.signals, props.icIDs, props.data, value]);

  let color, opacity;
  if (Number(value) > Number(props.widget.customProperties.threshold)) {
    color = props.widget.customProperties.on_color;
    opacity = props.widget.customProperties.on_color_opacity;
  } else {
    color = props.widget.customProperties.off_color;
    opacity = props.widget.customProperties.off_color_opacity;
  }

  let style = {
    backgroundColor: color,
    opacity: opacity
  };

  return (
    <div className="lamp-widget" style={style} />
  );
};

export default WidgetLamp;
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

import React, { useState } from "react";

const WidgetLine = (props) => {
  const [dimensions, setDimensions] = useState({
    width: props.widget.width || 0,
    height: props.widget.height || 0,
    editing: false,
  });

  const illustrateDuringEdit = (newWidth, newHeight) => {
    setDimensions({ width: newWidth, height: newHeight, editing: true });
  };

  // Assuming illustrateDuringEdit may be called from outside to update the dimensions.
  // If not, you can remove this line.
  props.illustrateDuringEditRef &&
    props.illustrateDuringEditRef(illustrateDuringEdit);

  let { rotation } = props.widget.customProperties;
  let rad = rotation * (Math.PI / 180);
  let length = dimensions.editing ? dimensions.width : props.widget.width;

  rotation = Math.abs(parseInt(rotation, 10));
  if (rotation % 90 === 0 && (rotation / 90) % 2 === 1) {
    length = dimensions.editing ? dimensions.height : props.widget.height;
  }

  // calculate line coordinates (in percent)
  const x1 = length * 0.5 - 0.5 * Math.cos(rad) * length;
  const x1p = `${Math.round((100 * x1) / length)}%`;

  const x2 = length * 0.5 + 0.5 * Math.cos(rad) * length;
  const x2p = `${Math.round((100 * x2) / length)}%`;

  const y1 = length * 0.5 + 0.5 * Math.sin(rad) * length;
  const y1p = `${Math.round((100 * y1) / length)}%`;

  const y2 = length * 0.5 - 0.5 * Math.sin(rad) * length;
  const y2p = `${Math.round((100 * y2) / length)}%`;

  const lineStyle = {
    stroke: props.widget.customProperties.border_color,
    strokeWidth: `${props.widget.customProperties.border_width}px`,
  };

  return (
    <svg height="100%" width="100%">
      <line x1={x1p} x2={x2p} y1={y1p} y2={y2p} style={lineStyle} />
    </svg>
  );
};

export default WidgetLine;

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

import React from "react";

const WidgetLabel = (props) => {
  const style = {
    fontSize: props.widget.customProperties.textSize + "px",
    color: props.widget.customProperties.fontColor,
    opacity: props.widget.customProperties.fontColor_opacity,
  };

  return (
    <div className="label-widget">
      <h4 style={style}>{props.widget.name}</h4>
    </div>
  );
};

export default WidgetLabel;

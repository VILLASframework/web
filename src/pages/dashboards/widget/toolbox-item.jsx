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
import classNames from "../../../utils/class-names";
import Icon from "../../../common/icon";

import { useDrag } from "react-dnd";

const ToolboxItem = ({ name, icon, disabled }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "widget",
      item: { name },
      options: {
        dropEffect: "copy",
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: !disabled,
    }),
    [name, disabled]
  );

  const itemClass = classNames({
    "toolbox-item": true,
    "toolbox-item-dragging": isDragging,
    "toolbox-item-disabled": disabled,
  });

  const content = (
    <span className="btn" style={{ marginTop: "5px" }}>
      {icon && <Icon style={{ marginRight: "5px" }} icon={icon} />}
      {name}
    </span>
  );

  return (
    <div className={itemClass} ref={!disabled ? dragRef : null}>
      {content}
    </div>
  );
};

ToolboxItem.defaultProps = {
  disabled: false,
};

export default ToolboxItem;

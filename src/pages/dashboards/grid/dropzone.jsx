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

import React, { useCallback, useRef } from "react";
import classNames from "../../../utils/class-names";
import { useDrop } from "react-dnd";

const Dropzone = ({ widgets, onDrop, editing, height, children }) => {
  const wrapperRef = useRef(null);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "widget",
      drop(item, monitor) {
        const position = monitor.getSourceClientOffset();
        const dropzoneRect = wrapperRef.current.getBoundingClientRect();

        // Convert to relative position
        const relativeX = position.x - dropzoneRect.left;
        const relativeY = position.y - dropzoneRect.top;

        // Compute z-index
        let maxZ = widgets.reduce((maxZ, widget) => {
          return widget && widget.z > maxZ ? widget.z : maxZ;
        }, 0);

        const z = item.name === "Box" ? 0 : maxZ >= 100 ? maxZ : maxZ + 10;

        onDrop(item, { x: relativeX, y: relativeY, z });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [widgets, onDrop]
  );

  const toolboxClass = classNames({
    "box-content": true,
    "toolbox-dropzone": true,
    "toolbox-dropzone-active": isOver && canDrop && editing,
    "toolbox-dropzone-editing": editing,
  });

  return (
    <div
      ref={(el) => {
        wrapperRef.current = el;
        drop(el);
      }}
      className={toolboxClass}
      style={{ height }}
    >
      {children}
    </div>
  );
};

export default Dropzone;

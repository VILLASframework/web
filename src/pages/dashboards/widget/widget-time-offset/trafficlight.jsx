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

import { forwardRef } from "react";

const TrafficLight = ({
  isHorizontal,
  height,
  isRedOn,
  isYellowOn,
  isGreenOn,
}) => {
  const lamps = [
    { color: "red", on: isRedOn },
    { color: "yellow", on: isYellowOn },
    { color: "green", on: isGreenOn },
  ];

  const width = height * 2.5;
  const lampGap = height * 0.15;
  const lampSize = ((isHorizontal ? width : height) - 4 * lampGap) / 3.5;
  const borderRadius = height * 0.2;

  return (
    <div
      className={`traffic-light ${isHorizontal ? "horizontal" : "vertical"}`}
      style={{
        width: isHorizontal ? width : height,
        height: isHorizontal ? height : width,
        gap: lampGap,
        padding: isHorizontal ? `0 ${lampGap}px` : `${lampGap}px 0`,
        borderRadius: borderRadius,
      }}
    >
      {lamps.map((lamp, i) => (
        <div
          key={i}
          className={`lamp ${lamp.color} ${lamp.on ? "on" : "off"}`}
          style={{
            width: lampSize,
            height: lampSize,
            flex: `0 0 ${lampSize}px`,
          }}
        />
      ))}
    </div>
  );
};

export default TrafficLight;

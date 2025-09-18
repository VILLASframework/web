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

const TrafficLight = (
  { isHorizontal, width, height, isRed, isYellow, isGreen },
  overlayRef
) => {
  const lamps = [
    { color: "red", on: isRed },
    { color: "yellow", on: isYellow },
    { color: "green", on: isGreen },
  ];

  return (
    <div className="traffic-light-container">
      <div
        ref={overlayRef}
        className={`traffic-light ${isHorizontal ? "horizontal" : "vertical"}`}
        style={{
          width: isHorizontal ? width : height,
          height: isHorizontal ? height : width,
        }}
      >
        {lamps.map((lamp, i) => (
          <div
            key={i}
            className={`lamp ${lamp.color} ${lamp.on ? "on" : "off"}`}
            style={{
              width: width / 5,
              height: width / 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TrafficLight;

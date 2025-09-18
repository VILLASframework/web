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

import { useState, useEffect, useRef } from "react";

// this is essentially a wrapper around standart Fullscreen API

const useFullscreen = () => {
  const fullscreenTargetRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFullscreenState = () =>
      setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener("fullscreenchange", updateFullscreenState);

    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      if (document.exitFullscreen) document.exitFullscreen();
    } else {
      if (fullscreenTargetRef.current.requestFullscreen)
        fullscreenTargetRef.current.requestFullscreen();
    }
  };

  return { fullscreenTargetRef, isFullscreen, toggleFullscreen };
};

export default useFullscreen;

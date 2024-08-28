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

const WidgetImage = (props) => {
  const [file, setFile] = useState(null);

  const widget = JSON.parse(JSON.stringify(props.widget));

  useEffect(() => {
    let widgetFile = widget.customProperties.file;
    if (widgetFile !== -1 && file === null) {
      // AppDispatcher.dispatch({
      //   type: "files/start-download",
      //   data: widgetFile,
      //   token: props.token,
      // });
    }
  }, [file, props.token, widget.customProperties.file]);

  useEffect(() => {
    if (widget.customProperties.file === -1) {
      widget.customProperties.update = false;
      if (file !== null) setFile(null);
    } else {
      console.log("looking in", props.files)
      let foundFile = props.files.find(
        (f) => f.id === parseInt(widget.customProperties.file, 10)
      );
      if (foundFile && widget.customProperties.update) {
        widget.customProperties.update = false;
        // AppDispatcher.dispatch({
        //   type: "files/start-download",
        //   data: foundFile.id,
        //   token: props.token,
        // });
        setFile(foundFile);
      }
    }
  }, [widget.customProperties, props.files, props.token, file]);

  const imageError = (e) => {
    console.error("Image error:", e);
  };

  let objectURL = file && file.objectURL ? file.objectURL : "";

  return (
    <div className="full">
      {objectURL ? (
        <img
          onError={imageError}
          className="full"
          alt={file.name}
          src={objectURL}
          onDragStart={(e) => e.preventDefault()}
        />
      ) : (
        <img className="full" alt="No file selected." />
      )}
    </div>
  );
};

export default WidgetImage;

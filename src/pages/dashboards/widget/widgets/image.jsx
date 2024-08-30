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
import { useLazyDownloadImageQuery } from "../../../../store/apiSlice";
import FileSaver from "file-saver";

const WidgetImage = (props) => {
  const [file, setFile] = useState(null);
  const [objectURL, setObjectURL] = useState("");

  const widget = JSON.parse(JSON.stringify(props.widget));

  const [triggerDownloadImage] = useLazyDownloadImageQuery();

  const handleDownloadFile = async (fileID) => {
    try {
        const res = await triggerDownloadImage(fileID);
        const blob = await res.data; // This is where you get the blob directly
        setObjectURL(URL.createObjectURL(blob))
    } catch (error) {
        console.error(`Failed to download file with ID ${fileID}`, error);
    }
  }

  useEffect(() => {
    if(file !== null){
      handleDownloadFile(file.id);
    }
  }, [file])

  useEffect(() => {
    let widgetFile = widget.customProperties.file;
    if (widgetFile !== -1 && file === null) {
    }
  }, [file, props.token, widget.customProperties.file]);

  useEffect(() => {
    if (widget.customProperties.file === -1) {
      widget.customProperties.update = false;
      if (file !== null) setFile(null);
    } else {
      let foundFile = props.files.find(
        (f) => f.id === parseInt(widget.customProperties.file, 10)
      );
      if (foundFile && widget.customProperties.update) {
        widget.customProperties.update = false;
        setFile(foundFile);
      }
    }
  }, [widget.customProperties, props.files, props.token, file]);

  const imageError = (e) => {
    console.error("Image error:", e);
  };

  //revoke object url when component unmounts
  useEffect(() => {
    return () => {
        if (objectURL) {
            URL.revokeObjectURL(objectURL);
        }
    };
}, [objectURL]);

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

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

import React, { useEffect, useRef, useState } from "react";

import { SwaggerUIBundle } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";
import "../styles/swagger-ui.css";
import RestAPI from "./api/rest-api";
import { useSelector } from "react-redux";

const APIBrowser = ({}) => {
  const [spec, setSpec] = useState(null);
  const ref = useRef(null);
  const { token: sessionToken } = useSelector((state) => state.auth);

  const mangleSpec = (s) => {
    s.host = window.location.host;
    return s;
  };

  useEffect(() => {
    RestAPI.get("/api/v2/openapi")
      .then((spec) => {
        setSpec(mangleSpec(spec));
      })
      .catch((err) => console.log("Error while loading OpenApi spec", err));
  }, []);

  useEffect(() => {
    if (!spec) return;
    if (ref.current?.destroy) ref.current.destroy();

    ref.current = SwaggerUIBundle({
      dom_id: "#swagger-ui",
      spec,
      deepLinking: true,
      tryItOutEnabled: true,
      requestInterceptor: (req) => {
        req.headers.Authorization = `Bearer ${sessionToken}`;
        return req;
      },
    });

    return () => {
      ref.current = null;
    };
  }, [spec]);

  return <div id="swagger-ui" />;
};

export default APIBrowser;

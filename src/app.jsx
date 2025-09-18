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
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "./common/header";
import Menu from "./common/menu";
import "./styles/app.css";
import "./styles/login.css";
import branding from "./branding/branding";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./styles/Trafficlight.css";

const App = () => {
  const isTokenExpired = (token) => {
    let decodedToken = decodeJWT(token);
    let timeNow = (new Date().getTime() + 1) / 1000;
    return decodedToken.exp < timeNow;
  };

  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  if (!isAuthenticated || isTokenExpired(token)) {
    console.log("APP redirecting to logout/login");
    return <Navigate to="/logout" />;
  } else {
    console.log("APP rendering app");
    const pages = branding.values.pages;

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="app">
          <Header />

          <div className="app-body app-body-spacing">
            <Menu currentRole={user.role} />

            <div className="app-content app-content-margin-left">
              <Outlet />
            </div>
          </div>

          {branding.getFooter()}
        </div>
      </DndProvider>
    );
  }
};

export default App;

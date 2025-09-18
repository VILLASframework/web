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
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./app.jsx";
import Login from "./pages/login/login";
import Logout from "./pages/login/logout";
import Home from "./common/home";
import InfrastructureComponent from "./pages/infrastructure/ic";
import Scenarios from "./pages/scenarios/scenarios";
import APIBrowser from "./common/api-browser";
import Scenario from "./pages/scenarios/scenario";
import Users from "./pages/users/users";
import Dashboard from "./pages/dashboards/dashboard.jsx";
import Account from "./pages/account/account";
import Infrastructure from "./pages/infrastructure/infrastructure";
import Usergroup from "./pages/usergroups/usergroup";
import DashboardErrorBoundary from "./pages/dashboards/dashboard-error-boundry";

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />

        <Route path="scenarios" element={<Scenarios />} />
        <Route path="scenarios/:scenarioId" element={<Scenario />} />

        <Route
          path="dashboards/:dashboardId"
          element={
            <DashboardErrorBoundary>
              <Dashboard />
            </DashboardErrorBoundary>
          }
        />

        <Route path="infrastructure" element={<Infrastructure />} />
        <Route
          path="infrastructure/:icId"
          element={<InfrastructureComponent />}
        />

        <Route path="account" element={<Account />} />

        <Route path="users" element={<Users />} />
        <Route path="usergroup/:usergroup" element={<Usergroup />} />

        <Route path="api" element={<APIBrowser />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Root;

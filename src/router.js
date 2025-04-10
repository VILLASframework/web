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
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./app";
import Login from "./pages/login/login";
import Logout from "./pages/login/logout";

class Root extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/logout'>
              <Logout />
            </Route>
            <Route path="/">
              <App />
            </Route>
          </Switch>
        </BrowserRouter>
    );
  }
}

export default Root;

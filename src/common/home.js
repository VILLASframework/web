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

import React from 'react';
import { villasweb_home } from '../branding/functions';
import { Redirect } from "react-router-dom";

class Home extends React.Component {

  getCounts(type) {
    if (this.state.hasOwnProperty('counts'))
      return this.state.counts[type];
    else
      return '?';
  }

  render() {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser == null) {
      console.log("HOME redirecting to logout/ login")
      return (<Redirect to="/logout" />);
    }

    return (
      <div>
        <h1>Home</h1>
        <p>
          Welcome to <b>{document.title}</b>!
        </p>
        <div className='home-container' id="brand-home">
          {villasweb_home(document.title,currentUser.username,currentUser.id,currentUser.role)}
        </div>
      </div>
    );
  }
}

export default Home;

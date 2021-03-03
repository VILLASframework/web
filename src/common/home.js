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

import { Redirect } from "react-router-dom";
import Branding from '../branding/branding';

// Logo is dynamically loaded from img folder, therefore the whole folder is required at this point
const images = require.context('../img', true)

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

    const branding = Branding.instance;

    return (
      <div className="home-container">
        <img style={{ height: 120, float: 'right' }} src={images("./" + branding.brand.logo).default} alt="Logo VILLASweb" />
        <h1>Home</h1>
        {branding.getHome(currentUser.username, currentUser.id, currentUser.role)}
        </div>
        );
        }
}

export default Home;

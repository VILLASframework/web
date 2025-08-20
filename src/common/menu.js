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
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useGetConfigQuery } from '../store/apiSlice';
import { useSelector } from 'react-redux';
import { villasweb_links, villasweb_logo } from '../branding/functions';

const SideBarMenu = (props) => {

  const [isExternalAuth, setIsExternalAuth] = useState(false);
  const [logoutLink, setLogoutLink] = useState('');
  
  const { user: currentUser } = useSelector((state) => state.auth);

  const {data: configRes} = useGetConfigQuery();

  useEffect(() => {
    if(configRes) {
      setLogoutLink(configRes.authentication.logout_url);
    }
  }, [configRes]);

  return (
    <div className="menucontainer">
      <div className="menulogo">
        <img style={{ width: 110, margin: 'auto' }} id="brand-menu-logo" src={villasweb_logo()}/>
      </div>
      <div className="menu">
        <h2>Menu</h2>

        {isExternalAuth ?
          <ul>
            <li>
              <NavLink
                to="/home"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Home">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/scenarios"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Scenarios">
                Scenarios
              </NavLink>
            </li>
            {currentUser.role === 'Admin'?
              <li>
                <NavLink
                  to="/infrastructure"
                  className={({isActive}) => (isActive ? "active" : "")}
                  title="Infrastructure">
                  Infrastructure
                </NavLink>
              </li> : ''
            }
            {currentUser.role === 'Admin' ?
              <li>
                <NavLink
                  to="/users"
                  className={({isActive}) => (isActive ? "active" : "")}
                  title="Users">
                  Users
                </NavLink>
              </li> : ''
            }
            <li>
              <NavLink
                to="/account"
                title="Account">
                Account
              </NavLink>
            </li>
            <a
              onClick={logout()}
              href={''}>
              Logout
            </a>
            <li>
              <NavLink
                to="/api"
                title="API Browser">
                API Browser
              </NavLink>
            </li>
          </ul>
          : <ul>
            <li>
              <NavLink
                to="/home"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Home">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/scenarios"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Scenarios">
                Scenarios
              </NavLink>
            </li>
            {currentUser.role === 'Admin'?
              <li>
                <NavLink
                  to="/infrastructure"
                  className={({isActive}) => (isActive ? "active" : "")}
                  title="Infrastructure">
                  Infrastructure
                </NavLink>
              </li> : ''
            }
            {currentUser.role === 'Admin' ?
              <li>
                <NavLink
                  to="/users"
                  className={({isActive}) => (isActive ? "active" : "")}
                  title="Users">
                  Users
                </NavLink>
              </li> : ''
            }
            <li>
              <NavLink
                to="/account"
                title="Account">
                Account
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logout"
                title="Logout">
                Logout
              </NavLink>
            </li>
            {currentUser.role === 'Admin'?
              <li>
                <NavLink
                  to="/api"
                  title="API Browser">
                  API Browser
                </NavLink>
              </li> : ''
            }
          </ul>}
          <div>
            <br></br>
            <h4> Links</h4>
            <ul id="brand-links">
              {villasweb_links()}
            </ul>
          </div>
      </div>


    </div>
  );
}

export default SideBarMenu;

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
import branding from '../branding/branding';
import { useGetConfigQuery } from '../store/apiSlice';
import { useSelector } from 'react-redux';

const SideBarMenu = (props) => {

  const values = branding.values;
  const [isExternalAuth, setIsExternalAuth] = useState(false);
  const [logoutLink, setLogoutLink] = useState('');
  
  const { user: currentUser } = useSelector((state) => state.auth);

  const {data: configRes} = useGetConfigQuery();

  useEffect(() => {
    if(configRes) {
      setLogoutLink(configRes.authentication.logout_url);
    }
  }, [configRes]);

  const getLinks = () => {
    let links = [];

    if (values.links) {
      Object.keys(values.links).forEach(key => {
        links.push(<li key={key}><a href={values.links[key]} title={key}>{key}</a></li>);
      })
    }

    return links;
  }

  return (
    <div className="menucontainer">
      { branding.getLogo() ?
        <div className="menulogo">
          {branding.getLogo({ width: 110, margin: 'auto' })}
        </div>
        : ''
      }
      <div className="menu">
        <h2>Menu</h2>

        {isExternalAuth ?
          <ul>
            <li hidden={!values.pages.home}>
              <NavLink
                to="/home"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Home">
                Home
              </NavLink>
            </li>
            <li hidden={!values.pages.scenarios}>
              <NavLink
                to="/scenarios"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Scenarios">
                Scenarios
              </NavLink>
            </li>
            {currentUser.role === 'Admin' || values.pages.infrastructure ?
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
            <li hidden={!values.pages.account}>
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
            <li hidden={!values.pages.api}>
              <NavLink
                to="/api"
                title="API Browser">
                API Browser
              </NavLink>
            </li>
          </ul>
          : <ul>
            <li hidden={!values.pages.home}>
              <NavLink
                to="/home"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Home">
                Home
              </NavLink>
            </li>
            <li hidden={!values.pages.scenarios}>
              <NavLink
                to="/scenarios"
                className={({isActive}) => (isActive ? "active" : "")}
                title="Scenarios">
                Scenarios
              </NavLink>
            </li>
            {currentUser.role === 'Admin' || values.pages.infrastructure ?
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
            <li hidden={!values.pages.account}>
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
            {currentUser.role === 'Admin' || values.pages.api ?
              <li>
                <NavLink
                  to="/api"
                  title="API Browser">
                  API Browser
                </NavLink>
              </li> : ''
            }
          </ul>}

        {
          getLinks().length > 0 ?
            <div>
              <br></br>
              <h4> Links</h4>
              <ul> {getLinks()} </ul>
            </div>
            : ''
        }
      </div>


    </div>
  );
}

export default SideBarMenu;

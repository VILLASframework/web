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

import React, {useEffect, useRef} from 'react';
import { NavbarBrand } from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from './login-form';
import Header from '../../common/header';
import NotificationsDataManager from '../../common/data-managers/notifications-data-manager';
import branding from '../../branding/branding';
import { useGetConfigQuery } from '../../store/apiSlice';

const Login = (props) => {

  const notificationSystem = useRef()

  useEffect(() => {
    NotificationsDataManager.setSystem(notificationSystem);
  }, []);

  const {data: config} = useGetConfigQuery();

  const { isAuthenticated } = useSelector((state) => state.auth);

  return !isAuthenticated ? 
    (
      <div>
        <NotificationSystem ref={notificationSystem} />
    
        <Header />
        <div className="login-parent">
          <div className="login-welcome">
            {branding.getWelcome()}
          </div>
    
          <div className="login-container">
            <NavbarBrand>Login</NavbarBrand>
            <LoginForm config={config} />
          </div>
        </div>
    
        {branding.getFooter()}
      </div>
    )
    :
    (<Redirect to="/home" />);
}

export default Login
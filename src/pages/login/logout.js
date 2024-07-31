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

import React, {useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { deleteUser } from '../../store/authSlice';

const Logout = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    if(isMounted) dispatch(deleteUser());

    return () => {isMounted = false};
  }, []);

  return (
    <Redirect to="/login" />
  )
}

export default Logout;

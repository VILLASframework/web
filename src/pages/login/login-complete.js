import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthenticateUserMutation } from '../../store/apiSlice';
import notificationsDataManager from "../../common/data-managers/notifications-data-manager";
import NotificationsFactory from "../../common/data-managers/notifications-factory";
import { setUser } from '../../store/authSlice';

const LoginComplete = () => {
  const dispatch = useDispatch();
  
  const { user, token } = useSelector((state) => state.auth);
  
  const [secondsToWait, setSecondsToWait] = useState(65);

  const [authenticateUser,{isError}] = useAuthenticateUserMutation();
  
  useEffect(() => {
    const performLogin = async () => {
      try {
        const res = await authenticateUser({mechanism: "external"});
        if(!res.error) {
          dispatch(setUser({user: res.data.user, token: res.data.token}));
        }
      } catch (err) {
        if(err.data){
          notificationsDataManager.addNotification(NotificationsFactory.UPDATE_ERROR(err.data.message));
        } else {
          console.log('Error', err);
        }
      }
    }

    performLogin();
  }, [authenticateUser]);

  useEffect(() => {
    let interval = null;
    if (secondsToWait > 0 && !user) {
      interval = setInterval(() => {
        setSecondsToWait((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [secondsToWait, user]);

  const getWaitingMessage = () => {
    if (secondsToWait < 20) return "Almost there ..";
    if (secondsToWait < 45) return "...";
    if (secondsToWait < 55) return "Configuring Simulators ..";
    if (secondsToWait < 60) return "Loading Scenarios ..";
    return "Please wait";
  };

  if (user && token) {
    return <Redirect to="/home" />;
  }

  if (secondsToWait === 0 || isError) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="verticalhorizontal">
      <p>{getWaitingMessage()}</p>
    </div>
  );
};

export default LoginComplete;
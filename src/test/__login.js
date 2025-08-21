
import React from "react";
import { screen,render,act,waitFor} from "@testing-library/react"
import {store} from "../store/index";
import {Router} from "react-router-dom";
import Login from "../pages/login/login";
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

//A small login test to see if we can set token from the test environment directly
//To potentially be used as a beforeEach on each subsequent test
test("Sets token and lands on home after login",async () => {
  const history = createMemoryHistory({ initialEntries: ['/home'] });
  render(
    <Provider store={store}>
      <Router history={history}>
        <Login/>
      </Router>
    </Provider>
  )
  await act(async ()=>{
    userEvent.type(screen.getByPlaceholderText('Username'),'admin')
  })
  await waitFor(async ()=>{
    expect(screen.getByPlaceholderText('Username').value).toBe('admin')
  })
  await act(async ()=>{
    userEvent.type(screen.getByPlaceholderText('Password'),'adminadmin')
  })
  await waitFor(async ()=>{
    expect(screen.getByPlaceholderText('Password').value).toBe('adminadmin')
  })

  await act(async ()=>{
    userEvent.click(screen.getByRole('button',{name:'Login'}))
  })

  await waitFor(async ()=>{
    expect(localStorage.getItem('token')).not.toBeNull()
    expect(localStorage.getItem('token')).not.toBeUndefined()
    expect(localStorage.getItem('token')).not.toBe('')
    expect(history.location.pathname).toBe('/home')
  })
});
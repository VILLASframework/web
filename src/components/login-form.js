/**
 * File: login-form.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 15.03.2017
 * Copyright: 2017, Institute for Automation of Complex Power Systems, EONERC
 *   This file is part of VILLASweb. All Rights Reserved. Proprietary and confidential.
 *   Unauthorized copying of this file, via any medium is strictly prohibited.
 **********************************************************************************/

import React, { Component } from 'react';
import { Form, Button, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';

import AppDispatcher from '../app-dispatcher';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    }
  }

  login(event) {
    // prevent from submitting the form since we send an action
    event.preventDefault();

    // send login action
    AppDispatcher.dispatch({
      type: 'users/login',
      username: this.state.username,
      password: this.state.password
    });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup controlId="username">
          <Col componentClass={ControlLabel} sm={2}>
            Username
          </Col>
          <Col sm={10}>
            <FormControl type="text" placeholder="Username" onChange={(e) => this.handleChange(e)} />
          </Col>
        </FormGroup>

        <FormGroup controlId="password">
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl type="password" placeholder="Password" onChange={(e) => this.handleChange(e)} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit" onClick={(e) => this.login(e)}>Login</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default LoginForm;

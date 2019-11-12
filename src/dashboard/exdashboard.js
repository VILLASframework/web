import React, { Component } from 'react';
import { Container } from 'flux/utils';
import DashboardStore from './dashboard-store';
import AppDispatcher from '../common/app-dispatcher';
import Table from '../common/table';
import TableColumn from '../common/table-column';
import UserStore from '../user/user-store'







class ExDashboard extends Component {
  static getStores() {
    return [ DashboardStore ];
  }
  
  static calculateState(prevState, props) {
    prevState = prevState || {};

    console.log("calculateState has been called");
    const dashboards = DashboardStore.getState();
    let tokenState = UserStore.getState().token;
    console.log(dashboards);

    return{
      dashboards,
      tokenState
    }
    
  }
  
  componentDidMount() {
    AppDispatcher.dispatch({
      type: 'dashboards/start-load',
      token: this.state.tokenState,
      param: 'scenarioID=1'
    });
  }
  



  render() {

    return (
      <div className='section'>
        <h1>Dashboards</h1>

        <Table data={this.state.dashboards}>
          <TableColumn title='Name' dataKey='name' link='/exdashboard/' linkKey='id' />
          <TableColumn title='Grid' dataKey='grid' link='/exdashboard/' linkKey='id' />
          <TableColumn title='ScenarioID' dataKey='scenarioID' link='/exdashboard/' linkKey='id' />
        </Table>
      </div>
    );
  }
}




let fluxContainerConverter = require('../common/FluxContainerConverter');
export default Container.create(fluxContainerConverter.convert(ExDashboard));

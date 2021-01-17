import React from 'react';
import {Button, Row, Col} from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';
import {Collapse} from 'react-collapse';
import Icon from "../common/icon";
import ConfirmCommand from './confirm-command';



class ICDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      confirmCommand: false,
      command: '',
      icStatus: {}
    };
  }

  static getDerivedStateFromProps(props, state){
    if(typeof props.icStatus !== 'undefined'){
      return {icStatus: props.icStatus}
    } else {
      return {}
    }
  }

  onClose(canceled) {
    this.props.onClose();
  }

  handleChange(e) {
    
  }

  showFurtherInfo(key){
    if(typeof this.state[key] === 'undefined') this.setState({[key]: false});
    this.setState({[key]: !this.state[key]});
  }

  graphError(e){
    console.log("graph error");
  }

  closeConfirmModal(canceled){
    if(!canceled){
      this.props.sendControlCommand(this.state.command,this.props.ic);
    }

    this.setState({confirmCommand: false, command: ''});
  }

  
  render() {

    let icStatus = this.state.icStatus;
    delete icStatus['icID'];

    let objectURL=''
    if(typeof this.props.icGraph !== "undefined") {
      objectURL = this.props.icGraph.objectURL
    }

    let spanStyle = {
      display: 'inline-block', 
      width: '130px'
    }
    
    return (
      <Dialog
        show={this.props.show}
        title="Status and Controls"
        buttonTitle="Close"
        onClose={(c) => this.onClose(c)}
        valid={true}
        size='xl'
        blendOutCancel = {true}
      >
        <form>
        <Row>
        <Col>
          <h5>Status:</h5>
          {
            typeof icStatus !== "undefined" && Object.keys(icStatus).map(statusKey => (
              typeof icStatus[statusKey] === 'object' ?
              (<div key={statusKey}>
                <Button variant="light" style={{backgroundColor: '#ffffff', borderColor: '#ffffff'}} onClick={() => this.showFurtherInfo(statusKey)}  >{statusKey}
                <Icon icon='chevron-down' style={{color: '#007bff'}}/></Button>
                  <Collapse isOpened={this.state[statusKey]} >
                    {
                      Object.keys(icStatus[statusKey]).map(key => (
                        typeof icStatus[statusKey][key] === 'object' ?
                          (<div key={key}>
                            <Button variant="light" onClick={() => this.showFurtherInfo(key)}  >{key}
                              <Icon icon='chevron-down' style={{ color: '#007bff' }} /></Button>
                            <Collapse isOpened={this.state[key]} >

                              {Object.keys(icStatus[statusKey][key]).map(index => (
                                <div key={index}> <span style={spanStyle}>{index + ":"}</span>{icStatus[statusKey][key][index]}</div>
                              ))}
                            </Collapse>
                          </div>)
                          :
                          (<div key={key}> <span style={spanStyle}>{key + ":"}</span>{icStatus[statusKey][key]}</div>)
                      ))
                    }
                  </Collapse>

              </div>) 
              :
              (<div key={statusKey}> <span style={spanStyle }>{statusKey + ":"}</span>{icStatus[statusKey]}</div>)
            ))
          }
          </Col>
          
          <Col>
          <h5>Graph:</h5>
          <div>
            {objectURL !== '' ? (
              <img onError={(e) => this.graphError(e)} alt={"Error"} src={objectURL} />
            ) : (
                <img alt="Error" />
              )}
          </div>
        
        {this.props.userRole === "Admin"? (
        <div>
        <h5>Controls:</h5>
        <div>
        <Button style={{ margin: '5px' }} size='lg' onClick={() => this.setState({ confirmCommand: true, command: 'restart' })}>Restart</Button>
        <Button style={{ margin: '5px' }} size='lg' onClick={() => this.setState({ confirmCommand: true, command: 'shutdown' })}>Shutdown</Button>
        </div>
        </div> )
        : (<div></div>) }

        <ConfirmCommand show={this.state.confirmCommand} command={this.state.command} name={this.props.ic.name} onClose={c => this.closeConfirmModal(c)} />
        </Col>
        </Row>
        </form>
      </Dialog>
      
    );
  }
}

export default ICDialog;

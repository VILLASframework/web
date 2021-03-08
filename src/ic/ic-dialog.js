import React from 'react';
import {Button, Row, Col} from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';
import Icon from "../common/icon";
import ConfirmCommand from './confirm-command';
import ReactJson from 'react-json-view';
import FileSaver from 'file-saver';


class ICDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      confirmCommand: false,
      command: '',
    };
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

  closeConfirmModal(canceled){
    if(!canceled){
      this.props.sendControlCommand(this.state.command,this.props.ic);
    }

    this.setState({confirmCommand: false, command: ''});
  }

  async downloadGraph(url) {

    let blob = await fetch(url).then(r => r.blob())
    FileSaver.saveAs(blob, this.props.ic.name + ".svg");
  }


  render() {

    let graphURL = ""
    if (this.props.ic.apiurl !== ""){
      graphURL = this.props.ic.apiurl + "/graph.svg"
    }


    return (
      <Dialog
        show={this.props.show}
        title={this.props.ic.name + " ( " + this.props.ic.uuid + " )"}
        buttonTitle="Close"
        onClose={(c) => this.onClose(c)}
        valid={true}
        size='xl'
        blendOutCancel={true}
      >
        <form>
          <Row>
            <Col>
              <h5>State: {this.props.ic.state}</h5>
              <h5>Category: {this.props.ic.category}</h5>
              <h5>Type: {this.props.ic.type}</h5>
              <h5>Uptime: {this.props.ic.uptime}</h5>
              <h5>Location: {this.props.ic.location}</h5>
              <h5>Description: {this.props.ic.description}</h5>
              <h5>Websocket URL: {this.props.ic.websocketurl}</h5>
              <h5>API URL: {this.props.ic.apiurl}</h5>
              <h5>Start parameter schema:</h5>
              <ReactJson
                src={this.props.ic.startParameterSchema}
                name={false}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                collapsed={0}
              />
            </Col>

            <Col>

              <h5>Raw Status:</h5>
              <ReactJson
                src={this.props.ic.statusupdateraw}
                name={false}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                collapsed={1}
              />

              {this.props.ic.type === "villas-node" || this.props.ic.type === "villas-relay" ? (
                <>
                  <div className='section-buttons-group-right'>
                    <Button style={{margin: '5px'}} size='sm' onClick={() => this.downloadGraph(graphURL)}><Icon
                      icon="download"/></Button>
                  </div>
                  <h5>Graph:</h5>
                  <div>
                    <img alt={"Graph image download failed and/or incorrect image API URL"} src={graphURL}/>
                  </div>

                  {this.props.userRole === "Admin" ? (
                      <div>
                        <h5>Controls:</h5>
                        <div className='solid-button'>
                          <Button variant='secondary' style={{margin: '5px'}} size='lg'
                                  onClick={() => this.setState({confirmCommand: true, command: 'restart'})}>Restart</Button>
                          <Button variant='secondary' style={{margin: '5px'}} size='lg' onClick={() => this.setState({
                            confirmCommand: true,
                            command: 'shutdown'
                          })}>Shutdown</Button>
                        </div>
                      </div>)
                    : (<div/>)}

                  <ConfirmCommand show={this.state.confirmCommand} command={this.state.command} name={this.props.ic.name}
                                  onClose={c => this.closeConfirmModal(c)}/>

                </>) : (<div/>)}
            </Col>
          </Row>
        </form>
      </Dialog>

    );
  }
}

export default ICDialog;

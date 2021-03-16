import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';
import Icon from "../common/icon";
import ConfirmCommand from './confirm-command';
import ReactJson from 'react-json-view';
import FileSaver from 'file-saver';
import moment from 'moment';

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

  isJSON(data){
    if (data === undefined || data === null){
      return false;
    }
    let str = JSON.stringify(data);
    try
    {
      JSON.parse(str)
    }
    catch(ex){
      return false
    }

    return true
  }


  render() {

    let graphURL = ""
    if (this.props.ic.apiurl !== ""){
      graphURL = this.props.ic.apiurl + "/graph.svg"
    }

    return (
      <Dialog
        show={this.props.show}
        title={this.props.ic.name}
        buttonTitle="Close"
        onClose={(c) => this.onClose(c)}
        valid={true}
        size='xl'
        blendOutCancel={true}
      >
        <form>
          <Row>
            <Col>
              <Row>
                <Col><b>Name</b></Col>
                <Col>{this.props.ic.name}</Col>
              </Row>
              <Row>
                <Col><b>UUID</b></Col>
                <Col>{this.props.ic.uuid}</Col>
              </Row>
              <Row>
                <Col><b>State</b></Col>
                <Col>{this.props.ic.state}</Col>
              </Row>
              <Row>
                <Col><b>Category</b></Col>
                <Col>{this.props.ic.category}</Col>
              </Row>
              <Row>
                <Col><b>Type</b></Col>
                <Col>{this.props.ic.type}</Col>
              </Row>
              <Row>
                <Col><b>Uptime</b></Col>
                <Col>{moment.duration(this.props.ic.uptime, "seconds").humanize()}</Col>
              </Row>
              <Row>
                <Col><b>Location</b></Col>
                <Col>{this.props.ic.location}</Col>
              </Row>
              <Row>
                <Col><b>Description</b></Col>
                <Col>{this.props.ic.description}</Col>
              </Row>
              <Row>
                <Col><b>Websocket URL</b></Col>
                <Col>{this.props.ic.websocketurl}</Col>
              </Row>
              <Row>
                <Col><b>API URL</b></Col>
                <Col>{this.props.ic.apiurl}</Col>
              </Row>
              <Row>
                <Col><b>Start parameter schema</b></Col>
                <Col>
                  <ReactJson
                    src={this.props.ic.startParameterSchema}
                    name={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={false}
                    collapsed={0}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <h5>Raw Status:</h5>
              {this.isJSON(this.props.ic.statusupdateraw) ?
                <ReactJson
                  src={this.props.ic.statusupdateraw}
                  name={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
                  collapsed={2}
                />
                :
                <div>No valid JSON raw data available.</div>
              }


              {this.props.ic.type === "villas-node" ?
                <>
                  <div className='section-buttons-group-right'>
                    <Button style={{margin: '5px'}} size='sm' onClick={() => this.downloadGraph(graphURL)}><Icon
                      icon="download"/></Button>
                  </div>
                  <h5>Graph:</h5>
                  <div>
                    <img alt={"Graph image download failed and/or incorrect image API URL"} src={graphURL}/>
                  </div>

                  {this.props.user.role === "Admin" ?
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
                    </div>
                    : <div/>
                  }
                  <ConfirmCommand show={this.state.confirmCommand} command={this.state.command} name={this.props.ic.name}
                                  onClose={c => this.closeConfirmModal(c)}/>
                </>
                : <div/>
              }
            </Col>
          </Row>
        </form>
      </Dialog>
    );
  }
}

export default ICDialog;

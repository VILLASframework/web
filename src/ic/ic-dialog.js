import React from 'react';
import {FormLabel, Button} from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';
import {Collapse} from 'react-collapse';
import Icon from "../common/icon";



class ICDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
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

  graphError(e){
    console.log("graph error");
  }

  render() {

    let objectURL=''
    if(typeof this.props.icGraph !== "undefined") {
      objectURL = this.props.icGraph.objectURL
    }
    
    return (
      <Dialog
        show={this.props.show}
        title="Infos and Controls"
        buttonTitle="Save"
        onClose={(c) => this.onClose(c)}
        valid={true}
        size='lg'
      >
        <form>
          <FormLabel>Status</FormLabel>
          {
            typeof this.props.icStatus !== "undefined" && Object.keys(this.props.icStatus).map(statusKey => (
              typeof this.props.icStatus[statusKey] === 'object' ?
              (<div>
                <Button variant="light" onClick={() => this.showFurtherInfo(statusKey)}  >{statusKey}
                <Icon icon='chevron-down' style={{color: '#007bff'}}/></Button>
                  <Collapse isOpened={this.state[statusKey]} >
                    {
                      Object.keys(this.props.icStatus[statusKey]).map(key => (
                        typeof this.props.icStatus[statusKey][key] === 'object' ?
                          (<div>
                            <Button variant="light" onClick={() => this.showFurtherInfo(key)}  >{key}
                              <Icon icon='chevron-down' style={{ color: '#007bff' }} /></Button>
                            <Collapse isOpened={this.state[key]} >

                              {Object.keys(this.props.icStatus[statusKey][key]).map(index => (
                                <div>{index + ": " + this.props.icStatus[statusKey][key][index]}</div>
                              ))}
                            </Collapse>
                          </div>)
                          :
                          (<div>{key + ": " + this.props.icStatus[statusKey][key]}</div>)
                      ))
                    }
                  </Collapse>

              </div>) 
              :
              (<div>{statusKey + ": " + this.props.icStatus[statusKey]}</div>)
            ))
          }
          <div>Graph:</div>
          <div>
            {objectURL !== '' ? (
              <img onError={(e) => this.graphError(e)} alt={"Error"} src={objectURL} />
            ) : (
                <img alt="Error" />
              )}
          </div>
        </form>
      </Dialog>
    );
  }
}

export default ICDialog;

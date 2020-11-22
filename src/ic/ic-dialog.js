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
      timezone: false,
      kernel: false,
      system: false,
    };
  }

/*  static getDerivedStateFromProps(props, state){
    let icStatus = props.icStatus;
    return {
      icStatus: icStatus,
      ic: props.ic,
    };
  }*/

  onClose(canceled) {
    this.props.onClose();
  }

  handleChange(e) {
    
  }

  showFurtherInfo(key){
    switch(key){
      case 'timezone':
        this.setState({timezone: !this.state.timezone});
        return;
      case 'kernel':
        this.setState({kernel: !this.state.kernel});
        return;
      case 'system':
        this.setState({system: !this.state.system});
        return;
    }
  }

  render() {
    
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
                      <div>{key + ": " + this.props.icStatus[statusKey][key]}</div>
                    ))
                  }
                </Collapse>

              </div>) 
              :
              (<div>{statusKey + ": " + this.props.icStatus[statusKey]}</div>)
            ))
          }
        </form>
      </Dialog>
    );
  }
}

export default ICDialog;

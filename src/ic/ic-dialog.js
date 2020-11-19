import React from 'react';
import {FormLabel} from 'react-bootstrap';
import Dialog from '../common/dialogs/dialog';


class ICDialog extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      ic: props.ic
    };
  }

  onClose(canceled) {
    this.props.onClose();
  }

  handleChange(e) {
    
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
          <FormLabel>Infos and Controls</FormLabel>
        </form>
      </Dialog>
    );
  }
}

export default ICDialog;

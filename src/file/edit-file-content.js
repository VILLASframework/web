/**
 * This file is part of VILLASweb.
 *
 * VILLASweb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * VILLASweb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with VILLASweb. If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import AppDispatcher from "../common/app-dispatcher";
import Dialog from '../common/dialogs/dialog';

class EditFileContent extends React.Component {
  valid = true;

  constructor(props) {
    super(props);

    this.state = {
      uploadFile: null,
    };
  }

  selectUploadFile(event) {
    this.setState({ uploadFile: event.target.files[0] });
  };

  startEditContent(){
    const formData = new FormData();
    formData.append("file", this.state.uploadFile);

    AppDispatcher.dispatch({
      type: 'files/start-edit',
      data: formData,
      token: this.props.sessionToken,
      id: this.props.file.id
    });

    this.setState({ uploadFile: null });
  };

  onClose = () => {
        this.props.onClose();
  };

  render() {
    return <Dialog
      show={this.props.show}
      title='Edit File Content'
      buttonTitle='Close'
      onClose={() => this.onClose()}
      blendOutCancel = {true}
      valid={true}
    >
      <Form.Group as={Col} >
        <Form.Control
          disabled={false}
          type='file'
          onChange={(event) => this.selectUploadFile(event)} />
      </Form.Group>

      <Form.Group as={Col} >
        <Button
          disabled={this.state.uploadFile === null}
          onClick={() => this.startEditContent()}>
          Upload
            </Button>
      </Form.Group>
    </Dialog>;
  }
}

export default EditFileContent;

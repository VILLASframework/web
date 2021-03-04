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
import Dialog from '../common/dialogs/dialog';
import ReactJson from 'react-json-view';


class ResultConfigDialog extends React.Component {
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

  render() {
    return (
      <Dialog
        show={this.props.show}
        title={"Component Configurations for Result No. " + this.props.resultNo}
        buttonTitle="Close"
        onClose={(c) => this.onClose(c)}
        valid={true}
        size="lg"
        blendOutCancel={true}
      >
        <form>
            <ReactJson
              src={this.props.configs}
              name={false}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
              collapsed={false}
            />
        </form>
      </Dialog>
    );
  }
}

export default ResultConfigDialog;

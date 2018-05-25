/**
 * File: selectFile.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 10.08.2018
 *
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
import { Container } from 'flux/utils';
import { FormGroup, FormControl, ControlLabel, Button, ProgressBar, Col } from 'react-bootstrap';

import FileStore from '../stores/file-store';
import UserStore from '../stores/user-store';

import AppDispatcher from '../app-dispatcher';

class SelectFile extends React.Component {
    static getStores() {
        return [ FileStore, UserStore ];
    }

    static calculateState() {
        return {
            files: FileStore.getState(),
            sessionToken: UserStore.getState().token,
            selectedFile: '',
            uploadFile: null,
            uploadProgress: 100
        };
    }

    componentDidMount() {
        AppDispatcher.dispatch({
            type: 'files/start-load',
            token: this.state.sessionToken
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === this.state.selectedSimulator) {
            return;
        }

        let selectedSimulator = nextProps.value;
        if (selectedSimulator == null) {
            if (this.state.simulators.length > 0) {
                selectedSimulator = this.state.simulators[0]._id;
            } else {
                selectedSimulator = '';
            }
        }

        this.setState({ selectedSimulator });
    }

    handleChange = event => {
        this.setState({ selectedFile: event.target.value });

        // send file to callback
        if (this.props.onChange != null) {
            const file = this.state.files.find(f => f._id === event.target.value);

            this.props.onChange(file);
        }
    }

    selectUploadFile = event => {
        this.setState({ uploadFile: event.target.files[0] });
    }

    startFileUpload = () => {
        // upload file
        const formData = new FormData();
        formData.append(0, this.state.uploadFile);

        AppDispatcher.dispatch({
            type: 'files/start-upload',
            data: formData,
            token: this.state.sessionToken,
            progressCallback: this.updateUploadProgress,
            finishedCallback: this.clearProgress
        });
    }

    updateUploadProgress = event => {
        this.setState({ uploadProgress: parseInt(event.percent.toFixed(), 10) });
    }

    clearProgress = () => {
        // select uploaded file
        const selectedFile = this.state.files[this.state.files.length - 1]._id;
        this.setState({ selectedFile, uploadProgress: 0 });
    }

    render() {
        const fileOptions = this.state.files.map(f => 
            <option key={f._id} value={f._id}>{f.name}</option>
        );

        const divStyle = {
            
        };

        return <div style={divStyle}>
            <FormGroup>
                <Col componentClass={ControlLabel} sm={3} md={2}>
                    {this.props.name}
                </Col>
                
                <Col sm={9} md={10}>
                    <FormControl componentClass='select' placeholder='Select file' onChange={this.handleChange}>
                        {fileOptions}
                    </FormControl>
                </Col>
            </FormGroup>

            <FormGroup>
                <Col sm={9} md={10} smOffset={3} mdOffset={2}>
                    <FormControl type='file' onChange={this.selectUploadFile} />
                </Col>
            </FormGroup>

            <FormGroup>
                <Col sm={9} md={10} smOffset={3} mdOffset={2}>
                    <Button bsSize='small' onClick={this.startFileUpload}>
                        Upload file
                    </Button>

                    <ProgressBar striped active now={this.state.uploadProgress} label={this.state.uploadProgress + '%'} />
                </Col>
            </FormGroup>

            
            
        </div>;
    }
}

export default Container.create(SelectFile);

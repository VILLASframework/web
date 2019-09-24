/**
 * File: selectFile.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 10.05.2018
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

    constructor(props) {
        super(props);
        this.state = { type: props.type}
    }

    static getStores() {
        return [ FileStore, UserStore ];
    }

    static calculateState() {

        let static_files = [ { _id: "1", name: "Small Energy Consumer Example", url: "http://137.226.248.190:8082?uri=http://137.226.248.190:4040/files/file1.xml"},
                     { _id: "2", name: "WSCC-09_Neplan", url: "http://137.226.248.190:8082?uri=http://137.226.248.190:4040/files/file2.zip" } ];

        return {
            files: static_files,
            pinturaUrl: static_files[0].url,
            sessionToken: UserStore.getState().token,
            selectedFile: '',
            uploadFile: null,
            uploadProgress: 0
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
            this.setState({ pinturaUrl: file.url });
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
        let fileOptions = null;
        if (this.state.type === "model") {
            fileOptions = this.state.files.map(f =>
                <option key={f._id} value={f._id}>{f.name}</option>
            );
        }

        const progressBarStyle = {
            marginLeft: '100px', 
            marginTop: '-25px'
        };

        let modelOption = <Col sm={9} md={5}>
                              <Button href={this.state.pinturaUrl} bsSize='small' target="_blank" rel="noopener noreferrer"> Edit Model </Button>
                          </Col>;

        let option = this.state.type === "model" ? modelOption : null;

        return <div>
            <FormGroup>
                <Col componentClass={ControlLabel} sm={3} md={2}>
                    {this.props.name}
                </Col>
                
                <Col sm={9} md={5}>
                    <FormControl disabled={this.props.disabled} componentClass='select' placeholder='Select file' onChange={this.handleChange}>
                        {fileOptions}
                    </FormControl>
                </Col>
                {option}
            </FormGroup>;

            <FormGroup>
                <Col sm={9} md={10} smOffset={3} mdOffset={2}>
                    <Button disabled={this.props.disabled} bsSize='small' onClick={this.startFileUpload}>
                        Upload file
                    </Button>

                    <ProgressBar striped active now={this.state.uploadProgress} label={this.state.uploadProgress + '%'} style={progressBarStyle} />
                </Col>
            </FormGroup>
        </div>;
    }
}

export default Container.create(SelectFile);

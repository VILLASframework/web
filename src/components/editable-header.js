/**
 * File: header.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 25.05.2018
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
import PropTypes from 'prop-types';
import { Glyphicon, FormControl } from 'react-bootstrap';

class EditableHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            title: props.title
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ title: nextProps.title });
    }

    startEditing = () => {
        this.setState({ editing: true });
    }

    stopEditing = () => {
        this.setState({ editing: false });
    }

    onChange = event => {

    }

    render() {
        if (this.state.editing) {
            const editStyle = {
                maxWidth: '500px'
            };

            return <div>
                <form>
                    <FormControl type='text' bsSize='large' value={this.state.title} onChange={this.onChange} style={editStyle} />
                </form>

                <Glyphicon glyph='ok' onClick={this.stopEditing} />
            </div>;
        }

        return <div>
            <h1>
                {this.state.title}
            </h1>

            <Glyphicon glyph='pencil' onClick={this.startEditing} />
        </div>;
    }
}

EditableHeader.PropTypes = {
    title: PropTypes.string
};

export default EditableHeader;

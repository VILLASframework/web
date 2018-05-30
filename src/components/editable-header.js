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

    edit = () => {
        this.setState({ editing: true });
    }

    save = () => {
        this.setState({ editing: false });

        if (this.props.onChange != null) {
            this.props.onChange(this.state.title);
        }
    }

    cancel = () => {
        this.setState({ editing: false, title: this.props.title });
    }

    onChange = event => {
        this.setState({ title: event.target.value });
    }

    render() {
        const wrapperStyle= {
            float: 'left'
        };

        const glyphStyle = {
            float: 'left',

            marginLeft: '10px',
            marginTop: '25px',
            marginBottom: '20px'
        };

        if (this.state.editing) {
            const editStyle = {
                maxWidth: '500px',

                marginTop: '10px'
            };

            return <div>
                <form style={wrapperStyle}>
                    <FormControl type='text' bsSize='large' value={this.state.title} onChange={this.onChange} style={editStyle} />
                </form>

                <a onClick={this.save}><Glyphicon glyph='ok' style={glyphStyle} /></a>
                <a onClick={this.cancel}><Glyphicon glyph='remove' style={glyphStyle} /></a>
            </div>;
        }

        return <div>
            <h1 style={wrapperStyle}>
                {this.state.title}
            </h1>

            <a onClick={this.edit}><Glyphicon glyph='pencil' style={glyphStyle} /></a>
        </div>;
    }
}

EditableHeader.PropTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func
};

export default EditableHeader;

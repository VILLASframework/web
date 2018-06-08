/**
 * File: header.js
 * Author: Markus Grigull <mgrigull@eonerc.rwth-aachen.de>
 * Date: 06.06.2018
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
import JsonView from 'react-json-view';

class ParametersEditor extends React.Component {
    onAdd = event => {
        if (this.props.onChange != null) {
            this.props.onChange(JSON.parse(JSON.stringify(event.updated_src)));
        }
    }

    onEdit = event => {
        if (this.props.onChange != null) {
            this.props.onChange(JSON.parse(JSON.stringify(event.updated_src)));
        }
    }

    onDelete = event => {
        if (this.props.onChange != null) {
            this.props.onChange(JSON.parse(JSON.stringify(event.updated_src)));
        }
    }

    render() {
        const containerStyle = {
            minHeight: '100px',

            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '8px',

            border: '1px solid lightgray'
        };

        return <div style={containerStyle}>
            <JsonView
                src={this.props.content}
                name={false}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                onAdd={this.props.disabled ? undefined : this.onAdd}
                onEdit={this.props.disabled ? undefined : this.onEdit}
                onDelete={this.props.disabled ? undefined : this.onDelete}
            />
        </div>;
    }
}

ParametersEditor.PropTypes = {
    content: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};

ParametersEditor.defaultProps = {
    content: {},
    disabled: false
};

export default ParametersEditor;

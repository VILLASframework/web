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
// TODO remove this file (not used!)
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import Icon from './icon';

class EditableHeader extends React.Component {
    titleInput = null;

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            title: props.title
        };
    }

    static getDerivedStateFromProps(props, state){
      return {
        title: props.title
      };
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

        const iconStyle = {
            float: 'right',

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
                <Form style={wrapperStyle}>
                    <Form.Control
                      type='text'
                      size='large'
                      value={this.state.title}
                      onChange={this.onChange}
                      style={editStyle}
                      autoFocus
                    />
                </Form>

                <Button
                  onClick={this.save}>
                    <Icon icon='check' style={iconStyle} />
                </Button>
                <Button
                  onClick={this.cancel}>
                    <Icon icon='times' style={iconStyle} />
                </Button>
            </div>;
        }

        return <div>
            <h1 style={wrapperStyle}>
                {this.state.title}
            </h1>

            <Button onClick={this.edit}><Icon icon='edit' style={iconStyle} /></Button>
        </div>;
    }
}

EditableHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func
};

export default EditableHeader;

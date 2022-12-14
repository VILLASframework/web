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

 import { Button } from 'react-bootstrap';
 
 import Icon from '../icon';
 
 
 class IconTextButton extends React.Component {
 
   render() {
     let defaultButtonStyle = {
      height: '36px',
      width: '100px',
      fontSize: '11px'
     }
 
     return (<span className={this.props.className ? this.props.className : 'icon-button'}><Button
     variant={this.props.variant ? this.props.variant : 'light'}
     disabled={this.props.disabled}
     onClick={this.props.onClick}
     style={this.props.buttonStyle ? this.props.buttonStyle : defaultButtonStyle}
   >
     {this.props.text}
     <Icon
       icon={this.props.icon}
       style={this.props.iconStyle}
     />
   </Button></span>);
   }
 }
 
 export default IconTextButton;
 
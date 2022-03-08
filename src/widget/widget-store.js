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


import ArrayStore from '../common/array-store';
import WidgetsDataManager from './widgets-data-manager';

class WidgetStore extends ArrayStore {
  constructor() {
    super('widgets', WidgetsDataManager);
  }

  reduce(state, action) {
    switch (action.type) {

      case 'widgets/loaded':

        //WidgetsDataManager.loadFiles(action.token, action.data);
        // TODO make sure files of scenario are loaded
        return super.reduce(state, action);

      case 'widgets/signal-value-changed':
        // update all widgets in widget store that use the current signal

        if (action.values.length === 0 || action.signalID === 0){
          console.log("WARNING: attempt to update widget signal value(s) on loopback, " +
            "but no value(s) or invalid signal ID provided");
          return;
        }

        state.forEach(function (widget, index) {

          if (!widget.hasOwnProperty("signalIDs")){
            return;
          }

          for(let i = 0; i<widget.signalIDs.length; i++){
            if(widget.signalIDs[i] === action.signalID){

              if(widget.hasOwnProperty("customProperties")){
                if (widget.customProperties.hasOwnProperty("value")){
                  let currentValue = widget.customProperties.value
                  let typeOfValue = typeof currentValue

                  if ((typeOfValue === "number" || typeOfValue === "string") && widget.signalIDs.length === 1){
                    // widget uses only one signal, save first value in widget
                    widget.customProperties.value = action.values[0]
                  } else if (typeOfValue === "array" && widget.signalIDs.length > 1){
                    // widget uses array of signals, save complete array
                    widget.customProperties.value = action.values
                  } else {
                    console.log("WARNING: attempt tp update widget signal value(s) on loopback, " +
                      "but incompatible values (type or length of array) provided");
                  }

                } else {
                  console.log("WARNING: attempt tp update widget signal value(s) on loopback, " +
                    "but affected widget (ID=", widget.id, ") does not have customProperties.value field");
                }
              } else {
                console.log("WARNING: attempt tp update widget signal value(s) on loopback, " +
                  "but affected widget (ID=", widget.id, ") does not have customProperties field");
              }
            } // if signal found
          } // for
        })

        // explicit call to prevent array copy
        this.__emitChange();

        return state;

      default:
        return super.reduce(state, action);

    }
  }

}

export default new WidgetStore();

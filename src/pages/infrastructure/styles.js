import { isICOutdated } from "../../utils/icUtils";

export const buttonStyle = {
    marginLeft: '5px',
}

export const iconStyle = {
  height: '25px',
  width: '25px'
}

//outputs a corresponding style for a LabelColumn Component
export const stateLabelStyle = (state, component) => {
    let style = [];

    switch (state) {
      case 'error':
        style[0] = 'danger';
        break;
      case 'idle':
        style[0] = 'primary';
        break;
      case 'starting':
        style[0] = 'info';
        break;
      case 'running':
        style[0] = 'success';
        break;
      case 'pausing':
        style[0] = 'info';
        break;
      case 'paused':
        style[0] = 'info';
        break;
      case 'resuming':
        style[0] = 'warning';
        break;
      case 'stopping':
        style[0] = 'warning';
        break;
      case 'resetting':
        style[0] = 'warning';
        break;
      case 'shuttingdown':
        style[0] = 'warning';
        break;
      case 'shutdown':
        style[0] = 'warning';
        break;

      default:
        style[0] = 'secondary';
    }

    style[1] = isICOutdated(component) && state !== 'shutdown' ? 'badge-outdated' : ''

    return style;
  }
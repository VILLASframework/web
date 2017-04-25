# <img src="doc/pictures/villas_web.png" width=40 /> VILLASweb

## Description

This is VILLASweb, the website displaying and processing simulation data in the web browser. The term __frontend__ refers to this project, the actual website.

The frontend connects to __two__ backends: _VILLASweb-backend_ and _VILLASnode_.

VILLASnode provides actual simulation data via websockets. VILLASweb-backend provides any other data like user acounts, simulation configuration etc.

For more information on the backends see their repositories.

## Frameworks

The frontend is build upon [ReactJS](https://facebook.github.io/react/) and [Flux](https://facebook.github.io/flux/).

React is responsible for rendering the UI and Flux for handling the data and communication with the backends. For more information also have a look at REACT.md

Additional libraries are used, for a complete list see package.json.

## Quick start

To start the website locally run `npm start`. This will open a local webserver serving the _frontend_. To make the website work, you still need to start at least the VILLASweb-backend (See repository for information).


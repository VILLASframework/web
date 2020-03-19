/// FluxContainerConverter.js
/// This is an ugly workaround found here https://github.com/facebook/flux/issues/351 to make Flux Containers work with ES6


function convert(containerClass) {
  const tmp = containerClass;
  containerClass = function(...args) {
    return new tmp(...args);
  };
  containerClass.prototype = tmp.prototype;
  containerClass.getStores = tmp.getStores;
  containerClass.calculateState = tmp.calculateState;
  return containerClass;
}

export {convert}


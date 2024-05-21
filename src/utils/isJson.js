export const isJSON = (data) => {
    if (data === undefined || data === null) {
      return false;
    }
    let str = JSON.stringify(data);
    try {
      JSON.parse(str)
    }
    catch (ex) {
      return false
    }
    return true
  }
export const isICOutdated = (component) => {
    if (!component.stateUpdateAt)
      return true;

    const fiveMinutes = 5 * 60 * 1000;

    return Date.now() - new Date(component.stateUpdateAt) > fiveMinutes;
}

export const downloadGraph = async (url) => {
    let blob = await fetch(url).then(r => r.blob())
    FileSaver.saveAs(blob, this.props.ic.name + ".svg");
}
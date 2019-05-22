const logEvent = () => console.log(e);
const nodeListToArray = (nodeList) => Array.prototype.slice.call(nodeList);

module.exports = {
    logEvent,
    nodeListToArray
};

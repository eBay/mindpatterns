$(function() {
    var Accordion = require('./accordion.js');

    function nodeListToArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }

    $('.skipto').skipTo();

    nodeListToArray(document.querySelectorAll('.accordion')).forEach(function(el) {
        return new Accordion(el);
    })
});

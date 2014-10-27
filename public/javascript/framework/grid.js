var Grid = function (DOMElement) {
    if (DOMElement) {
        this.init(DOMElement);
    }
}

Grid.prototype.init = function (DOMElement) {
    this.dom = DOMElement;
}

Grid.prototype.getCells() {
    return this.dom.childNodes;
}
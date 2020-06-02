export default class EventElementFinder {
  constructor(maxAncestorsChecks = 0) {
    this.maxAncestorsChecks = maxAncestorsChecks;
  }

  firstWithAttribute(event, attribute) {
    let elements = event.composedPath();

    elements = this._removeWindowAndDocumentFromList(elements);

    elements = this._applyLimitIfNecessary(elements);

    return elements.find(element => element.hasAttribute(attribute));
  }

  _removeWindowAndDocumentFromList(elements) {
    return elements.slice(0, elements.length - 2);
  }

  _applyLimitIfNecessary(elements) {
    if (this._notNecessaryApplyLimit(this.maxAncestorsChecks)) {
      return elements;
    }

    return elements.slice(0, this.maxAncestorsChecks);
  }

  _notNecessaryApplyLimit(elements) {
    return this.maxAncestorsChecks == 0 || elements.length <= this.maxAncestorsChecks;
  }
}

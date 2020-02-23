const DATASET = 'data-analytics';

export default class MutationListener {
  constructor(mutations, target, dispatcheEvent) {
    this.target = target;
    this.mutations = mutations;
    this.dispatcheEvent = dispatcheEvent;
  }

  registerMutationsListeners() {
    this.observer = new MutationObserver(this._mutationHandler.bind(this));
    this.observer.observe(this.target, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style'],
    });
  }

  removeMutationsListeners() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  _mutationHandler(mutations) {
    for (let mutation of mutations) {
      this._checkShowAttributes(mutation);
      this._checkShowAddedNodes(mutation);
    }
  }

  _checkShowAttributes(mutation) {
    if (mutation.type === 'attributes' && isShowEvent(mutation.target) && mutation.attributeName === 'style') {
      if (isVisibleElement(mutation.target)) this.dispatcheEvent(mutation.target);
    }
  }

  _checkShowAddedNodes(mutation) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (let node of mutation.addedNodes) {
        if (isShowEvent(node) && isVisibleElement(node)) this.dispatcheEvent(node);
      }
    }
  }
}

const isShowEvent = node => node.hasAttribute([`${DATASET}-show`]);

const isVisibleElement = element => element.style.display != 'none' && element.style.visibility != 'hidden';

const DATASET = 'data-analytics';

let observer;

const isShowEvent = (node) => node.dataset && node.hasAttribute([`${DATASET}-show`]);

const isVisibleElement = (element) => element.style.display != 'none' && element.style.visibility != 'hidden';

const mutationHandler = (mutations, dispatcheEventData) => {
    for(let mutation of mutations) {

        // Showed 
        if (mutation.type === 'attributes' && isShowEvent(mutation.target) && mutation.attributeName === 'style') {
            if (isVisibleElement(mutation.target)) dispatcheEventData(mutation.target)
        }

        // Added
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
                if (isShowEvent(node) && isVisibleElement(node)) dispatcheEventData(node)
            }
        }
    }
}

export const registerMutationsListeners = (target, dispatcheEventData) => {
    observer = new MutationObserver((mutationsList) => mutationHandler(mutationsList, dispatcheEventData));
    observer.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style']
    });
};

export const removeMutationsListeners = () => {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
};
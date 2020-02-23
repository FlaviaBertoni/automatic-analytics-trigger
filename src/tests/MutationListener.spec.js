import MutationListener from '../main/MutationListener';

const mutations = ['show'];
const target = jest.fn();
const dispatcheEvent = jest.fn();

const mockMutationObserverInstance = { observe: jest.fn(), disconnect: jest.fn() };
global.MutationObserver = jest.fn(callback => {
  mockMutationObserverInstance.callback = callback;
  return mockMutationObserverInstance;
});

describe('When MutationListener constructor is called', () => {
  it('should initilize the mutationListener instance with params', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);

    expect(mutationListener.mutations).toEqual(mutations);
    expect(mutationListener.target).toEqual(target);
    expect(mutationListener.dispatcheEvent).toEqual(dispatcheEvent);
  });
});

describe('When registerMutationsListeners is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create a new MutationObserver instance', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.registerMutationsListeners();

    expect(mutationListener.observer).toEqual(mockMutationObserverInstance);
  });

  it('should call observe', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.registerMutationsListeners();

    expect(mutationListener.observer.observe).toHaveBeenCalledTimes(1);
    expect(mutationListener.observer.observe).toHaveBeenCalledWith(target, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style'],
    });
  });
});

describe('When a mutation occurs and observer callback is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call dispatcheEvent with mutation target when style change to visible', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.registerMutationsListeners();

    const mutationTarget = { hasAttribute: jest.fn(() => true), style: { display: 'visible' } };
    mutationListener.observer.callback([
      {
        type: 'attributes',
        attributeName: 'style',
        target: mutationTarget,
      },
    ]);

    expect(mutationListener.dispatcheEvent).toHaveBeenCalledTimes(1);
    expect(mutationListener.dispatcheEvent).toHaveBeenCalledWith(mutationTarget);
  });

  it('should not call dispatcheEvent when style change to hidden', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.registerMutationsListeners();

    const mutationTarget = { hasAttribute: jest.fn(() => true), style: { display: 'none' } };
    mutationListener.observer.callback([
      {
        type: 'attributes',
        attributeName: 'style',
        target: mutationTarget,
      },
    ]);

    expect(mutationListener.dispatcheEvent).not.toHaveBeenCalled();
  });

  it('should call dispatcheEvent with mutation target when a visible element is added to DOM', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.registerMutationsListeners();

    const mutationTarget = { hasAttribute: jest.fn(() => true), style: { display: 'visible' } };
    mutationListener.observer.callback([
      {
        type: 'childList',
        addedNodes: [mutationTarget],
      },
    ]);

    expect(mutationListener.dispatcheEvent).toHaveBeenCalledTimes(1);
    expect(mutationListener.dispatcheEvent).toHaveBeenCalledWith(mutationTarget);
  });

  it('should not call dispatcheEvent when a hidden element is added to DOM', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.registerMutationsListeners();

    const mutationTarget = { hasAttribute: jest.fn(() => true), style: { visibility: 'hidden' } };
    mutationListener.observer.callback([
      {
        type: 'childList',
        addedNodes: [mutationTarget],
      },
    ]);

    expect(mutationListener.dispatcheEvent).not.toHaveBeenCalled();
  });
});

describe('When removeMutationsListeners is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call observer disconnect', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.registerMutationsListeners();
    mutationListener.removeMutationsListeners();

    expect(mockMutationObserverInstance.disconnect).toHaveBeenCalledTimes(1);
    expect(mutationListener.observer).toBeNull();
  });

  it('should not call observer disconnect when observer is empty', () => {
    const mutationListener = new MutationListener(mutations, target, dispatcheEvent);
    mutationListener.removeMutationsListeners();
    expect(mockMutationObserverInstance.disconnect).not.toHaveBeenCalled();
  });
});

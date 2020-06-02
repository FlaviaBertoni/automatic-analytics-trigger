import EventListener from '../main/EventListener';

import EventElementFinder from '../main/EventElementFinder';

const events = ['click'];
const target = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
const dispatcheEvent = jest.fn();
const finder = new EventElementFinder();

describe('When EventListener constructor is called', () => {
  it('should initilize the eventListener instance with params', () => {
    const eventListener = new EventListener(events, target, dispatcheEvent, finder);

    expect(eventListener.events).toEqual(events);
    expect(eventListener.target).toEqual(target);
    expect(eventListener.dispatcheEvent).toEqual(dispatcheEvent);
  });

  it('should initilize the listeners with default value', () => {
    const eventListener = new EventListener(events, target, dispatcheEvent, finder);
    expect(eventListener.listeners).toEqual({});
  });
});

describe('When registerEventsListeners is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should set listeners with event callback', () => {
    const eventListener = new EventListener(events, target, dispatcheEvent, finder);
    eventListener.registerEventsListeners();

    expect(eventListener.listeners).toEqual({ click: expect.any(Function) });
  });

  it('should add addEventListener to the target with event', () => {
    const eventListener = new EventListener(events, target, dispatcheEvent, finder);
    eventListener.registerEventsListeners();

    expect(eventListener.target.addEventListener).toHaveBeenCalledWith('click', eventListener.listeners.click, false);
  });
});

describe('When an event is dispatched and event listener is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call dispatcheEvent when target has analytics dataset with registered event', () => {
    const eventListener = new EventListener(events, target, dispatcheEvent, finder);
    eventListener.registerEventsListeners();

    const htmlDiv = document.createElement('div');
    const event = mockEventWithDataAnalyticsAttribute(htmlDiv, 'click');

    eventListener.listeners.click(event, 'data-analytics-click');

    expect(eventListener.dispatcheEvent).toHaveBeenCalledTimes(1);
    expect(eventListener.dispatcheEvent).toHaveBeenCalledWith(htmlDiv);
  });

  it('should not call dispatcheEvent when target has not analytics dataset with registered event', () => {
    const eventListener = new EventListener(events, target, dispatcheEvent, finder);
    eventListener.registerEventsListeners();

    const htmlDiv = document.createElement('div');
    const event = mockEventWithDataAnalyticsAttribute(htmlDiv, 'blur');

    eventListener.listeners.click(event, 'data-analytics-blur');

    expect(eventListener.dispatcheEvent).not.toHaveBeenCalled();
  });
});

describe('When removeEventsListeners is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call removeEventListener to each event', () => {
    const eventListener = new EventListener(['click', 'focus'], target, dispatcheEvent, finder);
    eventListener.registerEventsListeners();
    eventListener.removeEventsListeners();

    expect(target.removeEventListener).toHaveBeenCalledTimes(2);
    expect(target.removeEventListener).toHaveBeenCalledWith('click', eventListener.listeners.click, false);
    expect(target.removeEventListener).toHaveBeenCalledWith('focus', eventListener.listeners.focus, false);
  });
});

const mockEventWithDataAnalyticsAttribute = (element, eventName) => {
  element.setAttribute(`data-analytics-${eventName}`, '');

  return {
    composedPath() {
      return [element, 'document', 'window'];
    },
  };
};

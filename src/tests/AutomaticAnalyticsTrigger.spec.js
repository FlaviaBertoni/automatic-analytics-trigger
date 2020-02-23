import AutomaticAnalyticsTrigger from '../main/AutomaticAnalyticsTrigger';
import config from '../config';

import EventListener from '../main/EventListener';
jest.mock('../main/EventListener');

import MutationListener from '../main/MutationListener';
jest.mock('../main/MutationListener');

const mockCallback = jest.fn();

const customConfig = {
  target: 'customTargetElement',
  events: ['customEvent'],
  mutations: ['customMutation'],
};

describe('When AutomaticAnalyticsTrigger constructor is called', () => {
  it('should initilize the automaticAnalyticsTrigger instance with default values when a config is not informed', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback);

    expect(automaticAnalyticsTrigger.target).toEqual(config.target);
    expect(automaticAnalyticsTrigger.events).toEqual(config.events);
    expect(automaticAnalyticsTrigger.mutations).toEqual(config.mutations);
  });

  it('should initilize the automaticAnalyticsTrigger instance with a custom config values correctly', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback, customConfig);

    expect(automaticAnalyticsTrigger.target).toEqual(customConfig.target);
    expect(automaticAnalyticsTrigger.events).toEqual(customConfig.events);
    expect(automaticAnalyticsTrigger.mutations).toEqual(customConfig.mutations);
  });

  it('should set callback function', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback);
    expect(automaticAnalyticsTrigger.callback).toEqual(mockCallback);
  });
});

describe('When automaticAnalyticsTrigger init is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should register events listeners', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback);
    automaticAnalyticsTrigger.init();

    const mockEventListenerInstance = EventListener.mock.instances[0];
    expect(mockEventListenerInstance.registerEventsListeners).toHaveBeenCalledWith();
  });

  it('should not register events listeners when events are empty', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback, { ...config, events: undefined });
    automaticAnalyticsTrigger.init();
    expect(EventListener.mock.instances).toHaveLength(0);
  });

  it('should register mutations listeners', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback);
    automaticAnalyticsTrigger.init();

    const mockMutationListenerInstance = MutationListener.mock.instances[0];
    expect(mockMutationListenerInstance.registerMutationsListeners).toHaveBeenCalledWith();
  });

  it('should not register mutations listeners when mutations are empty', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback, { ...config, mutations: undefined });
    automaticAnalyticsTrigger.init();
    expect(MutationListener.mock.instances).toHaveLength(0);
  });
});

describe('When automaticAnalyticsTrigger close is called', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should remove events listeners', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback);
    automaticAnalyticsTrigger.init();
    automaticAnalyticsTrigger.close();

    const mockEventListenerInstance = EventListener.mock.instances[0];
    expect(mockEventListenerInstance.removeEventsListeners).toHaveBeenCalledWith();
  });

  it('should not remove events listeners when events are empty', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback, { ...config, events: undefined });
    automaticAnalyticsTrigger.init();
    automaticAnalyticsTrigger.close();

    expect(EventListener.mock.instances).toHaveLength(0);
  });

  it('should remove mutations listeners', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback);
    automaticAnalyticsTrigger.init();
    automaticAnalyticsTrigger.close();

    const mockMutationListenerInstance = MutationListener.mock.instances[0];
    expect(mockMutationListenerInstance.removeMutationsListeners).toHaveBeenCalledWith();
  });

  it('should not remove mutations listeners when mutations are empty', () => {
    const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback, { ...config, mutations: undefined });
    automaticAnalyticsTrigger.init();
    automaticAnalyticsTrigger.close();

    expect(MutationListener.mock.instances).toHaveLength(0);
  });
});

describe('When automaticAnalyticsTrigger dispatcheEventData is called', () => {
  const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger(mockCallback);
  const target = {
    dataset: {
      analyticsEvent: 'event',
      analyticsEventCategory: 'eventCategory',
      analyticsEventLabel: 'eventLabel',
      analyticsEventAction: 'eventAction',
      analyticsEventValue: 'eventValue',
      analyticsScreenName: 'screenName',
      analyticsDimension32: 'dimension32',
      analyticsDimension84: 'dimension84',
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('should call callback with correctly event data', () => {
    automaticAnalyticsTrigger._dispatcheEventData(target);
    expect(mockCallback).toHaveBeenCalledWith({
      event: 'event',
      eventCategory: 'eventCategory',
      eventLabel: 'eventLabel',
      eventAction: 'eventAction',
      eventValue: 'eventValue',
      screenName: 'screenName',
      eventDimensions: {
        dimension32: 'dimension32',
        dimension84: 'dimension84',
      },
    });
  });

  it('should call callback with just event and screenName data', () => {
    automaticAnalyticsTrigger._dispatcheEventData({
      dataset: { analyticsEvent: 'load', analyticsScreenName: 'login' },
    });
    expect(mockCallback).toHaveBeenCalledWith({
      event: 'load',
      screenName: 'login',
    });
  });
});

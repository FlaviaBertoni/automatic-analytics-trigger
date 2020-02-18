import AutoTriggerTarget from '../main/AutoTriggerTarget';
import config from '../../config';

const mockEventListener = require.requireMock('../main/eventListener');
jest.mock('../main/eventListener', () => ({
    registerEventsListeners: jest.fn(),
    removeEventsListeners: jest.fn(),
}));

const mockMutationListener = require.requireMock('../main/mutationListener');
jest.mock('../main/mutationListener', () => ({
    registerMutationsListeners: jest.fn(),
    removeMutationsListeners: jest.fn(),
}));

const mockCallback = jest.fn();

const customConfig = {
    target: 'customTargetElement',
    events: ['customEvent'],
    mutations: ['customMutation']
};

describe('When AutoTriggerTarget constructor is called', () => {

    it('should initilize the autoTriggerTarget instance with default values when a config is not informed', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback);

        expect(autoTriggerTarget.target).toEqual(config.target);
        expect(autoTriggerTarget.events).toEqual(config.events);
        expect(autoTriggerTarget.mutations).toEqual(config.mutations);
    });

    it('should initilize the autoTriggerTarget instance with a custom config values correctly', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback, customConfig);

        expect(autoTriggerTarget.target).toEqual(customConfig.target);
        expect(autoTriggerTarget.events).toEqual(customConfig.events);
        expect(autoTriggerTarget.mutations).toEqual(customConfig.mutations);
    });

    it('should set callback function', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback);
        expect(autoTriggerTarget.callback).toEqual(mockCallback);
    });
});

describe('When autoTriggerTarget init is called', () => {

    beforeEach(() => jest.clearAllMocks())

    it('should register events listeners', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback);
        autoTriggerTarget.init();
        expect(mockEventListener.registerEventsListeners).toHaveBeenCalledWith(
            autoTriggerTarget.events,
            autoTriggerTarget.target,
            expect.any(Function)
        );
    });

    it('should not register events listeners when events are empty', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback, { ...config, events: undefined });
        autoTriggerTarget.init();
        expect(mockEventListener.registerEventsListeners).not.toHaveBeenCalled();
    });

    it('should register mutations listeners', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback);
        autoTriggerTarget.init();
        expect(mockMutationListener.registerMutationsListeners).toHaveBeenCalledWith(
            autoTriggerTarget.target,
            expect.any(Function),
        );
    });

    it('should not register mutations listeners when mutations are empty', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback, { ...config, mutations: undefined });
        autoTriggerTarget.init();
        expect(mockMutationListener.registerMutationsListeners).not.toHaveBeenCalled();
    });
});

describe('When autoTriggerTarget close is called', () => {

    beforeEach(() => jest.clearAllMocks());

    it('should remove events listeners', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback);
        autoTriggerTarget.close();
        expect(mockEventListener.removeEventsListeners).toHaveBeenCalledWith(
            autoTriggerTarget.events,
            autoTriggerTarget.target,
            autoTriggerTarget.dispatcheEventData
        );
    });

    it('should not remove events listeners when events are empty', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback, { ...config, events: undefined });
        autoTriggerTarget.close();
        expect(mockEventListener.removeEventsListeners).not.toHaveBeenCalled();
    });

    it('should remove mutations listeners', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback);
        autoTriggerTarget.close();
        expect(mockMutationListener.removeMutationsListeners).toHaveBeenCalledWith();
    });

    it('should not remove mutations listeners when mutations are empty', () => {
        const autoTriggerTarget = new AutoTriggerTarget(mockCallback, { ...config, mutations: undefined });
        autoTriggerTarget.close();
        expect(mockMutationListener.removeMutationsListeners).not.toHaveBeenCalled();
    });
});

describe('When autoTriggerTarget dispatcheEventData is called', () => {

    const autoTriggerTarget = new AutoTriggerTarget(mockCallback);
    const target = { dataset: {
        analyticsEvent: 'event',
        analyticsEventCategory: 'eventCategory',
        analyticsEventLabel: 'eventLabel',
        analyticsEventAction: 'eventAction',
        analyticsEventValue: 'eventValue',
        analyticsScreenName: 'screenName',
        analyticsDimension32: 'dimension32',
        analyticsDimension84: 'dimension84',
    }};

    beforeEach(() => jest.clearAllMocks())

    it('should call callback with correctly event data', () => {
        autoTriggerTarget.dispatcheEventData(target);
        expect(mockCallback).toHaveBeenCalledWith({
            event: 'event',
            eventCategory: 'eventCategory',
            eventLabel: 'eventLabel',
            eventAction: 'eventAction',
            eventValue: 'eventValue',
            screenName: 'screenName',
            eventDimensions: {
                dimension32: 'dimension32',
                dimension84: 'dimension84'
            },
        });
    });

    it('should call callback with just event and screenName data', () => {
        autoTriggerTarget.dispatcheEventData({ dataset: { analyticsEvent: 'load', analyticsScreenName: 'login' } });
        expect(mockCallback).toHaveBeenCalledWith({
            event: 'load',
            screenName: 'login',
        });
    });
});

const DATASET = 'data-analytics';

const eventHandler = ({ target }, datasetEvent, dispatcheEvent) => {
    if (!target.hasAttribute(datasetEvent)) return;
    dispatcheEvent(target);
}

const listeners = {};

export const registerEventsListeners = (events, target, dispatcheEventData) => {
    for (const event of events) {
        listeners[event] = (e) => eventHandler(e, `${DATASET}-${event}`, dispatcheEventData);

        target.addEventListener(
            event, 
            listeners[event], 
            false
        );
    }
};

export const removeEventsListeners = (events, target, dispatcheEventData) => {
    for (const event of events) {
        target.removeEventListener(
            event, 
            listeners[event], 
            false
        );
    }
};
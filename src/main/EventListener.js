const DATASET = 'data-analytics';

export default class EventListener {
  constructor(events, target, dispatcheEvent, finder) {
    this.target = target;
    this.events = events;
    this.dispatcheEvent = dispatcheEvent;
    this.listeners = {};
    this.finder = finder;
  }

  registerEventsListeners() {
    for (const event of this.events) {
      this.listeners[event] = e => this._eventHandler(e, `${DATASET}-${event}`);

      this.target.addEventListener(event, this.listeners[event], false);
    }
  }

  removeEventsListeners() {
    for (const event of this.events) {
      this.target.removeEventListener(event, this.listeners[event], false);
    }
  }

  _eventHandler(event, datasetEvent) {
    const markedElement = this.finder.firstWithAttribute(event, datasetEvent);

    if (markedElement == undefined) return;

    this.dispatcheEvent(markedElement);
  }
}

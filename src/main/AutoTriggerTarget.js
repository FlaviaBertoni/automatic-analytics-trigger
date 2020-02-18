import defaultConfig from '../../config.js'
import { registerEventsListeners, removeEventsListeners } from './eventListener';
import { registerMutationsListeners, removeMutationsListeners } from './mutationListener';

const DATASET = 'data-analytics';

export default class AutoTriggerTarget {

  constructor(callback, config = defaultConfig) {
    this.callback = callback;
    this.target = config.target;
    this.events = config.events;
    this.mutations = config.mutations;

    this.dispatcheEventData = this.dispatcheEventData.bind(this)
  }

  init() {
    if (this.events) registerEventsListeners(this.events, this.target, this.dispatcheEventData);
    if (this.mutations) registerMutationsListeners(this.target, this.dispatcheEventData);
  }

  close() {
    if (this.events) removeEventsListeners(this.events, this.target, this.dispatcheEventData);
    if (this.mutations) removeMutationsListeners();
  }

  dispatcheEventData(target) {
    const eventData = this.getEventDataFromDataAttributes(target.dataset);
    this.callback(eventData);
  }

  getEventDataFromDataAttributes(dataset) {
    const dimensions = Object.keys(dataset).filter(key => key.includes('analyticsDimension')).reduce((obj, key) => {
      obj[key.replace('analyticsDimension', 'dimension')] = dataset[key];
      return obj;
    }, {});

    return {
      ...(dataset.analyticsEvent && {event: dataset.analyticsEvent}),
      ...(dataset.analyticsEventCategory && {eventCategory: dataset.analyticsEventCategory}),
      ...(dataset.analyticsEventAction && {eventAction: dataset.analyticsEventAction}),
      ...(dataset.analyticsEventLabel && {eventLabel: dataset.analyticsEventLabel}),
      ...(dataset.analyticsEventValue && {eventValue: dataset.analyticsEventValue}),
      ...(dataset.analyticsScreenName && {screenName: dataset.analyticsScreenName}),
      ...(Object.keys(dimensions).length > 0 && {eventDimensions: dimensions}),
    };
  }
}

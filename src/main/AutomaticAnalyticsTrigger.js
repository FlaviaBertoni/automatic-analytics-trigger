import defaultConfig from '../config';

import EventListener from './EventListener';

import EventElementFinder from './EventElementFinder';

import MutationListener from './MutationListener';

export default class AutomaticAnalyticsTrigger {
  constructor(callback, config) {
    config = { ...defaultConfig, ...config };

    this.callback = callback;
    this.target = config.target;
    this.events = config.events;
    this.mutations = config.mutations;
    this.maxAncestorsChecks = config.maxAncestorsChecks;

    this.finder = new EventElementFinder(this.maxAncestorsChecks);

    this._dispatcheEventData = this._dispatcheEventData.bind(this);
  }

  init() {
    if (this.events) {
      this.eventListener = new EventListener(this.events, this.target, this._dispatcheEventData, this.finder);
      this.eventListener.registerEventsListeners();
    }

    if (this.mutations) {
      this.mutationListener = new MutationListener(this.mutations, this.target, this._dispatcheEventData);
      this.mutationListener.registerMutationsListeners();
    }
  }

  close() {
    if (this.events) this.eventListener.removeEventsListeners();
    if (this.mutations) this.mutationListener.removeMutationsListeners();
  }

  _dispatcheEventData(target) {
    const eventData = this._getEventDataFromDataAttributes(target.dataset);
    this.callback(eventData);
  }

  _getEventDataFromDataAttributes(dataset) {
    const dimensions = Object.keys(dataset)
      .filter(key => key.includes('analyticsDimension'))
      .reduce((obj, key) => {
        obj[key.replace('analyticsDimension', 'dimension')] = dataset[key];
        return obj;
      }, {});

    return {
      ...(dataset.analyticsEvent && { event: dataset.analyticsEvent }),
      ...(dataset.analyticsEventCategory && { eventCategory: dataset.analyticsEventCategory }),
      ...(dataset.analyticsEventAction && { eventAction: dataset.analyticsEventAction }),
      ...(dataset.analyticsEventLabel && { eventLabel: dataset.analyticsEventLabel }),
      ...(dataset.analyticsEventValue && { eventValue: dataset.analyticsEventValue }),
      ...(dataset.analyticsScreenName && { screenName: dataset.analyticsScreenName }),
      ...(Object.keys(dimensions).length > 0 && { eventDimensions: dimensions }),
    };
  }
}

# automatic-analytics-trigger
Automatically trigger on events and mutations for sending analytics

## Installation

Install with npm:

```sh
npm i automatic-analytics-trigger -save
```

Or with yarn:

```sh
yarn add automatic-analytics-trigger
```

Or you can use the UMD build version in `dist/automatic-analytics-trigger.min.js` if you don't use a module bundler

https://unpkg.com/browse/automatic-analytics-trigger/dist/

and then add it to your html:

```html
<script src="https://unpkg.com/automatic-analytics-trigger/dist/automatic-analytics-trigger.min.js"></script>
```

To use a fixed version, see https://unpkg.com/

## Usage

Instantiate a new `AutomaticAnalyticsTrigger` passing a callback function that will be called each time a data event is dispatched. I suggest to use the callback to increment your `dataLayer` :)

```js
import AutomaticAnalyticsTrigger from 'automatic-analytics-trigger';

dataLayer = [];
const automaticAnalyticsTrigger = new AutomaticAnalyticsTrigger((dataEvent) => dataLayer.push(dataEvent));

automaticAnalyticsTrigger.init();

```

And add the analytics data attributes to the elements you want to watch:

```html
<button
    data-analytics-click 
    data-analytics-event="my-page-click"
    data-analytics-event-category="my-application:my-page"
    data-analytics-event-action="click:my-button"
    data-analytics-event-label="my-label-button"
    data-analytics-screen-name="my-page"
    data-analytics-dimension-22="my-dimension-value"
>
    Click to trigger
</button>
```

See the [demo](https://flaviabertoni.github.io/automatic-analytics-trigger/)

If you will use Google Analytics and you don't know how to configure it, see https://developers.google.com/tag-manager/quickstart.


## Configuration

You can use a custom configuration to change the `target`, `events` and `mutations` that will trigger your callback:

- **events**: any javascript event and custom event.  
  _Default value: `['click']`_
- **mutations**: a DOM mutation type, at this moment, `show`  is the only mutation implemented and it occurs when the element is displayed.  
  _Default value:  `['show']`_
- **target**: the element you want to listen `events` and `mutations`.  
  _Default value: `documentElement`_

```js
const callback = (dataEvent) => dataLayer.push(dataEvent);
const config = { events: ['click', 'focus'], target: document.getElementById('my-form')}

const myFormAnalyticsTrigger = new AutomaticAnalyticsTrigger(callback, config);
myFormAnalyticsTrigger.init();

```


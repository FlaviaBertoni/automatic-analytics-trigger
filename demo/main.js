const AutoTriggerTarget = require('automatic-analytics-trigger').default;

window.dataLayer = [];

const autoTriggerTarget = new AutoTriggerTarget((data) => {
    window.dataLayer.push(data);
});

autoTriggerTarget.init();

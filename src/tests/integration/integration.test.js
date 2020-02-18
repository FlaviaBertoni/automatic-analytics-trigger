const mockPage = require('./mockPage.html');
require('./mockScript');

import AutoTargetTrigger from '../../../main';

const createAutoAnalyticsTrigger = (config) => {
    window.dataLayer = [];
    const targetTrigger = new AutoTargetTrigger((data) => window.dataLayer.push(data), config);
    return targetTrigger;
};

describe('integration tests', () => {

    it('should dispatch data events correctly with default config', async () => {

        // GIVEN

        const targetTrigger = createAutoAnalyticsTrigger();
        targetTrigger.init();

        document.body.innerHTML = mockPage;


        // WHEN

        await sleep(0);

        const buttonClick = document.getElementById('button-click');
        buttonClick.click();

        const hiddenElement = document.getElementById('hidden-element');
        hiddenElement.style.display = 'visible';

        const buttonAdd = document.getElementById('button-add');
        buttonAdd.click();

        await sleep(0);

        const buttonUntrack = document.getElementById('button-untrack');
        buttonUntrack.click();

        hiddenElement.style.display = 'none';

        buttonClick.click();

        await sleep(0);

        buttonClick.click();

        targetTrigger.close();

        // THEN

        expect(window.dataLayer).toHaveLength(6);

        expect(window.dataLayer[0]).toEqual({
            event: 'page-view',
            screenName: 'mock-page',
        });

        expect(window.dataLayer[1]).toEqual({
            event: 'page-click',
            eventCategory: 'my-application:page',
            eventAction: 'click:trigger-button',
            eventLabel: 'success',
            screenName: 'mock-page',
            eventDimensions: { 'dimension-22': 'test' },
        });

        expect(window.dataLayer[2]).toEqual({
            event: 'page-load',
            eventCategory: 'my-application:page',
            eventAction: 'load:search',
            eventLabel: 'success',
            screenName: 'mock-page',
        });

        expect(window.dataLayer[3]).toEqual({
            event: 'alert-error',
            eventCategory: 'my-application:page',
            eventAction: 'click:add',
            eventLabel: 'error',
            screenName: 'mock-page',
        });

        expect(window.dataLayer[4]).toEqual({
            event: 'page-click',
            eventCategory: 'my-application:page',
            eventAction: 'click:trigger-button',
            eventLabel: 'success',
            screenName: 'mock-page',
            eventDimensions: { 'dimension-22': 'test' },
        });

        expect(window.dataLayer[5]).toEqual({
            event: 'page-click',
            eventCategory: 'my-application:page',
            eventAction: 'click:trigger-button',
            eventLabel: 'success',
            screenName: 'mock-page',
            eventDimensions: { 'dimension-22': 'test' },
        });
    });

    it('should dispatch data events correctly with custom config', async () => {

        // GIVEN

        document.body.innerHTML = mockPage;

        //Section 1
        const section1Trigger = createAutoAnalyticsTrigger({
            events: [ 'click' ],
            target: document.getElementById('section-1')
        });

        section1Trigger.init();

        //Section 2
        const section2Trigger = createAutoAnalyticsTrigger({
            events: [ 'mouseout' ],
            mutations: [ 'show' ],
            target: document.getElementById('section-2')
        });

        section2Trigger.init();


        // WHEN

        const buttonClick = document.getElementById('button-click');
        buttonClick.click();

        const buttonOut = document.getElementById('button-out');
        buttonOut.click();

        const buttonAdd = document.getElementById('button-add');
        buttonAdd.click();

        section1Trigger.close();

        await sleep(0);

        buttonAdd.click();

        const buttonOonmouseout = document.getElementById('button-onmouseout');
        simulate(buttonOonmouseout, 'mouseout');

        section2Trigger.close();

        await sleep(0);


        // THEN

        expect(window.dataLayer).toHaveLength(3);

        expect(window.dataLayer[0]).toEqual({
            event: 'page-click',
            eventCategory: 'my-application:page',
            eventAction: 'click:trigger-button',
            eventLabel: 'success',
            screenName: 'mock-page',
            eventDimensions: { 'dimension-22': 'test' },
        });

        expect(window.dataLayer[1]).toEqual({
            event: 'alert-error',
            eventCategory: 'my-application:page',
            eventAction: 'click:add',
            eventLabel: 'error',
            screenName: 'mock-page',
        });

        expect(window.dataLayer[2]).toEqual({
            event: 'page-mouseout',
        });

    });
});

const sleep = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms));

const simulate = (element, event) => {
	element.dispatchEvent(new Event(event, {
		bubbles: true,
		cancelable: true,
		view: window
    }));
};

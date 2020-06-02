import EventElementFinder from '../main/EventElementFinder';
const mockPage = require('./eventElementFinderMockPage.html');

const ATTRIBUTE_NAME = 'data-analytics-click';
const DIV_ID = 'section-1';

describe('EventElementFinder', () => {
  describe('When firstWithAttribute is called with maxIterationLimit', () => {
    let button1, eventElementFinder;

    beforeEach(() => {
      document.body.innerHTML = mockPage;
      button1 = document.querySelector('#button-1');
    });

    it('when maxAncestorsChecks equals element position should return div#section-1', async () => {
      eventElementFinder = new EventElementFinder(3);

      const element = mockClickEventAndFindElement(button1, eventElementFinder, ATTRIBUTE_NAME);

      expect(element.id).toEqual(DIV_ID);
    });

    it('when maxAncestorsChecks grater than element position should return div#section-1', async () => {
      eventElementFinder = new EventElementFinder(4);

      const element = mockClickEventAndFindElement(button1, eventElementFinder, ATTRIBUTE_NAME);

      expect(element.id).toEqual(DIV_ID);
    });

    it('when maxAncestorsChecks less than element position should return null', async () => {
      eventElementFinder = new EventElementFinder(2);

      const element = mockClickEventAndFindElement(button1, eventElementFinder, ATTRIBUTE_NAME);

      expect(element).toBeUndefined();
    });
  });
});

const mockClickEventAndFindElement = (button, finder, attributeToFind) => {
  let element;

  button.addEventListener('click', event => {
    element = finder.firstWithAttribute(event, attributeToFind);
  });

  button.click();

  return element;
};

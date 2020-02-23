/** CLICK DEMO **/
const dataLayerClick = [];
const dataLayerClickElement = document.getElementById('data-layer-click');
const clickDemo = document.getElementById('click-demo');

// Init AutomaticAnalyticsTrigger to listen click events in click demo container
new AutomaticAnalyticsTrigger(
  function(data) {
    dataLayerClick.push(data);
    dataLayerClickElement.innerHTML = JSON.stringify(dataLayerClick, undefined, 4);
  },
  { events: ['click'], target: clickDemo },
).init();

/** SHOW DEMO **/
const dataLayerShow = [];
const dataLayerShowElement = document.getElementById('data-layer-show');
const showDemo = document.getElementById('show-demo');

// Init AutomaticAnalyticsTrigger to listen show mutations in show demo container
new AutomaticAnalyticsTrigger(
  function(data) {
    dataLayerShow.push(data);
    dataLayerShowElement.innerHTML = JSON.stringify(dataLayerShow, undefined, 4);
  },
  { mutations: ['show'], target: showDemo },
).init();

/** ALERT SWITCH FUNCTION **/
const switchAlert = function() {
  const alert = document.getElementById('alert');
  const visibility = alert.style.visibility;
  alert.style.visibility = visibility === 'hidden' ? 'visible' : 'hidden';
};

switchAlert();

/** PRETTY CODE FUNCTIONS **/
function htmlEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/" /g, '"\n\t')
    .replace(/=""/g, '');
}

/** ADD BUTTON PRETTY CODE **/
const button = document.getElementById('click-trigger-button').innerHTML.replace(/ {13}/g, '');
document.getElementById('add-analytics-click-element').innerHTML = htmlEscape(button);

/** ADD ALERT PRETTY CODE **/
const alert = document.getElementById('show-trigger-alert').innerHTML.replace(/ {26}/g, '');
document.getElementById('add-analytics-show-element').innerHTML = htmlEscape(alert);

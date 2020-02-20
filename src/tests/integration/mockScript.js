const addErrorAlert = () => {
  const alert = document.createElement('div');
  alert.id = 'alert-error';
  alert.dataset.analyticsShow = '';
  alert.dataset.analyticsEvent = 'alert-error';
  alert.dataset.analyticsEventCategory = 'my-application:page';
  alert.dataset.analyticsEventAction = 'click:add';
  alert.dataset.analyticsEventLabel = 'error';
  alert.dataset.analyticsScreenName = 'mock-page';

  const page = document.getElementById('section-2');
  page.appendChild(alert);
};

window.addErrorAlert = addErrorAlert;

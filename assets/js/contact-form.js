(function () {
  var form = document.querySelector('[data-contact-form]');
  var status = document.querySelector('[data-contact-status]');

  if (!form || !status || !window.fetch) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending...';
    status.hidden = true;
    status.removeAttribute('data-state');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (!response.ok || data.ok !== true) {
            throw new Error(data.error || 'Sorry, the message could not be sent right now. Please try again shortly.');
          }
          return data;
        });
      })
      .then(function () {
        form.reset();
        status.textContent = 'Thank you for getting in touch. Your message has been sent.';
        status.setAttribute('data-state', 'success');
        status.hidden = false;
      })
      .catch(function (error) {
        status.textContent = error.message;
        status.setAttribute('data-state', 'error');
        status.hidden = false;
      })
      .then(function () {
        button.disabled = false;
        button.textContent = 'Send message';
      });
  });
}());

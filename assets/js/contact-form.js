(function () {
  var form = document.querySelector('[data-contact-form]');
  var status = document.querySelector('[data-contact-status]');
  var email = document.querySelector('#contact-email');

  if (!form || !status || !email || !window.fetch) return;

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail() {
    var value = email.value.trim();
    email.setCustomValidity('');

    if (value !== '' && (!emailPattern.test(value) || email.validity.typeMismatch)) {
      email.setCustomValidity('Incorrect email address');
    }
  }

  email.addEventListener('input', validateEmail);
  email.addEventListener('invalid', function () {
    if (email.value.trim() !== '') {
      email.setCustomValidity('Incorrect email address');
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    validateEmail();

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
        var heading = document.createElement('span');
        var message = document.createElement('span');

        heading.className = 'contact-success-heading';
        heading.textContent = 'Thank you for getting in touch.';
        message.className = 'contact-success-message';
        message.textContent = 'Your message has been sent.';

        status.textContent = '';
        status.appendChild(heading);
        status.appendChild(message);
        status.setAttribute('data-state', 'success');
        status.hidden = false;
        form.classList.add('is-sent');
        status.focus();
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

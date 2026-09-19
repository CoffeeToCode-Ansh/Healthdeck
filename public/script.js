const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = type || '';
}

function validateClientSide(data) {
  if (!data.name.trim()) return 'Please enter your name.';
  if (!EMAIL_RE.test(data.email.trim())) return 'Please enter a valid email address.';
  if (!data.message.trim()) return 'Please enter a message.';
  return null;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  // Fast client-side check first — the API re-validates everything server-side regardless,
  // since client-side checks can always be bypassed.
  const clientError = validateClientSide(data);
  if (clientError) {
    setStatus(clientError, 'error');
    return;
  }

  submitBtn.disabled = true;
  setStatus('Sending…', '');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setStatus(result.message, 'success');
      form.reset();
    } else {
      setStatus(result.message || 'Something went wrong. Please try again.', 'error');
    }
  } catch (err) {
    setStatus('Network error — please check your connection and try again.', 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

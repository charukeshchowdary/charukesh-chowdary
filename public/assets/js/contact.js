document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target).entries());
  const msg = document.getElementById('contactMsg');

  try {
    await fetchJson(`${API_BASE}/contacts`, { method: 'POST', body: JSON.stringify(formData) });
    msg.textContent = 'Inquiry submitted successfully. Our team will contact you shortly.';
    event.target.reset();
  } catch (error) {
    msg.textContent = error.message;
  }
});

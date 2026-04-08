const analyticsNode = document.getElementById('analytics');

const ensureAdmin = () => {
  const user = tokenStore.user;
  if (!tokenStore.token || !user || user.role !== 'admin') {
    analyticsNode.innerHTML = '<p class="muted">Please login as admin from the user dashboard first.</p>';
    return false;
  }
  return true;
};

const renderAnalytics = async () => {
  if (!ensureAdmin()) return;
  const data = await fetchJson(`${API_BASE}/admin/analytics`);
  analyticsNode.innerHTML = [
    `<div class="card"><h3>Users</h3><p class="kpi">${data.totals.users}</p></div>`,
    `<div class="card"><h3>Loan Applications</h3><p class="kpi">${data.totals.loans}</p></div>`,
    `<div class="card"><h3>Inquiries</h3><p class="kpi">${data.totals.inquiries}</p></div>`
  ].join('');
};

const renderUsers = async () => {
  if (!ensureAdmin()) return;
  const users = await fetchJson(`${API_BASE}/admin/users`);
  document.getElementById('userRows').innerHTML = users
    .map((user) => `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td></tr>`)
    .join('');
};

const renderContacts = async () => {
  if (!ensureAdmin()) return;
  const contacts = await fetchJson(`${API_BASE}/contacts`);
  document.getElementById('contactRows').innerHTML = contacts
    .map((entry) => `<tr><td>${entry.name}</td><td>${entry.email}</td><td>${entry.status}</td></tr>`)
    .join('');
};

document.getElementById('contentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!ensureAdmin()) return;

  const body = Object.fromEntries(new FormData(event.target).entries());
  const key = body.key;
  delete body.key;

  try {
    await fetchJson(`${API_BASE}/content/${key}`, { method: 'PUT', body: JSON.stringify(body) });
    document.getElementById('contentMsg').textContent = 'Content saved successfully.';
  } catch (error) {
    document.getElementById('contentMsg').textContent = error.message;
  }
});

renderAnalytics();
renderUsers();
renderContacts();

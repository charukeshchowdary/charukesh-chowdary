const authMsg = document.getElementById('authMsg');
const loanMsg = document.getElementById('loanMsg');

const renderLoans = async () => {
  if (!tokenStore.token) return;
  const loans = await fetchJson(`${API_BASE}/loans/my`);
  const rows = document.getElementById('loanRows');
  rows.innerHTML = loans
    .map((loan) => {
      const statusClass = `status-${loan.status.toLowerCase().replace(/\s+/g, '-')}`;
      return `<tr>
        <td>${loan.loanType}</td>
        <td>₹${loan.loanAmount.toLocaleString()}</td>
        <td><span class="badge ${statusClass}">${loan.status}</span></td>
        <td>${loan.pdfSummaryUrl ? `<a href="${loan.pdfSummaryUrl}" target="_blank">Download</a>` : '-'}</td>
      </tr>`;
    })
    .join('');
};

document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(event.target).entries());
  try {
    const data = await fetchJson(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(body) });
    tokenStore.token = data.token;
    authMsg.textContent = 'Registered successfully. Please verify OTP from your email.';
  } catch (error) {
    authMsg.textContent = error.message;
  }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const body = Object.fromEntries(new FormData(event.target).entries());
  try {
    const data = await fetchJson(`${API_BASE}/auth/login`, { method: 'POST', body: JSON.stringify(body) });
    tokenStore.token = data.token;
    tokenStore.user = data.user;
    authMsg.textContent = `Welcome ${data.user.name}.`;
    renderLoans();
  } catch (error) {
    authMsg.textContent = error.message;
  }
});

document.getElementById('loanForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!tokenStore.token) {
    loanMsg.textContent = 'Please login before submitting a loan application.';
    return;
  }

  const formData = new FormData(event.target);

  try {
    const response = await fetch(`${API_BASE}/loans`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenStore.token}` },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Submission failed');

    loanMsg.textContent = 'Loan submitted successfully.';
    event.target.reset();
    renderLoans();
  } catch (error) {
    loanMsg.textContent = error.message;
  }
});

renderLoans();

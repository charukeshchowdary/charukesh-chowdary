const branchList = document.getElementById('branchList');

const renderBranches = (branches) => {
  branchList.innerHTML = branches
    .map(
      (branch) => `
      <article class="card">
        <h3>${branch.name}</h3>
        <p>${branch.address}, ${branch.city}, ${branch.state}</p>
        <p><strong>Phone:</strong> ${branch.phone}</p>
        <iframe title="${branch.name}" src="${branch.mapEmbedUrl}" width="100%" height="220" style="border:0" loading="lazy"></iframe>
      </article>`
    )
    .join('');

  if (!branches.length) branchList.innerHTML = '<p class="muted">No branches found.</p>';
};

const fetchBranches = async () => {
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const query = new URLSearchParams({ city, state }).toString();
  const data = await fetchJson(`${API_BASE}/branches?${query}`);
  renderBranches(data);
};

document.getElementById('searchBranch').addEventListener('click', fetchBranches);
fetchBranches();

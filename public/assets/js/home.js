const calcBtn = document.getElementById('calcBtn');
if (calcBtn) {
  calcBtn.addEventListener('click', () => {
    const p = Number(document.getElementById('loanAmount').value);
    const annualRate = Number(document.getElementById('interestRate').value);
    const n = Number(document.getElementById('tenureMonths').value);
    const r = annualRate / 12 / 100;
    const emi = (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    document.getElementById('emiResult').textContent = `EMI: ₹${Number.isFinite(emi) ? emi.toFixed(2) : 0} / month`;
  });
}

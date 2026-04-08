const runCalc = document.getElementById('runCalc');

const calculateEMI = (p, annualRate, n) => {
  const r = annualRate / 12 / 100;
  const emi = (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const total = emi * n;
  return { emi, total, interest: total - p };
};

runCalc.addEventListener('click', () => {
  const p = Number(document.getElementById('amount').value);
  const rate = Number(document.getElementById('rate').value);
  const n = Number(document.getElementById('months').value);
  const result = calculateEMI(p, rate, n);

  document.getElementById('calcOutput').textContent = `Monthly EMI: ₹${result.emi.toFixed(2)}`;
  document.getElementById('calcBreakup').textContent = `Total Interest: ₹${result.interest.toFixed(2)} | Total Payable: ₹${result.total.toFixed(2)}`;
});

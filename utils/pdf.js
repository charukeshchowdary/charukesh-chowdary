const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const generateLoanSummaryPdf = (loan) => {
  const fileName = `loan-summary-${loan._id}.pdf`;
  const outputPath = path.join(__dirname, '..', 'uploads', fileName);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text('Tummala Finance - Loan Summary', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Application ID: ${loan._id}`);
  doc.text(`Applicant Name: ${loan.applicantName}`);
  doc.text(`Loan Type: ${loan.loanType}`);
  doc.text(`Loan Amount: ₹${loan.loanAmount}`);
  doc.text(`Tenure: ${loan.tenureMonths} months`);
  doc.text(`Interest Rate: ${loan.interestRate}%`);
  doc.text(`Status: ${loan.status}`);
  doc.text(`Submitted On: ${new Date(loan.createdAt).toLocaleString()}`);
  doc.moveDown();
  doc.text('Tummala Finance');
  doc.text('Trusted Financial Solutions for Your Future');

  doc.end();
  return `/uploads/${fileName}`;
};

module.exports = { generateLoanSummaryPdf };

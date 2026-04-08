const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicantName: { type: String, required: true },
    loanType: {
      type: String,
      enum: ['Gold Loan', 'Personal Loan', 'Business Loan', 'Insurance', 'Investments'],
      required: true
    },
    loanAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], default: 'Pending' },
    documentUrl: { type: String, default: null },
    pdfSummaryUrl: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);

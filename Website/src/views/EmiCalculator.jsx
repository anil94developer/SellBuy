import React from 'react';
import { useEmiCalculatorViewModel } from '../viewmodels/useEmiCalculatorViewModel';

export function EmiCalculator({ t }) {
  const {
    loanAmount,
    setLoanAmount,
    interestRate,
    setInterestRate,
    tenureMonths,
    setTenureMonths,
    monthlyEmi,
    totalInterest
  } = useEmiCalculatorViewModel();

  return (
    <section className="web-container" id="emi-calculator" style={{ marginBottom: 60 }}>
      <div className="emi-calculator-card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: 20, alignItems: 'center' }}>
        <div>
          <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Smart Finance</span>
          <h3 style={{ fontSize: 26, fontWeight: 800, margin: '8px 0 16px 0' }}>{t('emiTitle')}</h3>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
            Lowest interest rates starting from 8.75% with zero pre-closure charges from partner banks.
          </p>

          <div className="emi-inputs-grid">
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>LOAN AMOUNT (₹)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="text-input boxed-input"
                style={{ color: '#fff', background: 'rgba(255,255,255,0.08)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>INTEREST RATE (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="text-input boxed-input"
                style={{ color: '#fff', background: 'rgba(255,255,255,0.08)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>TENURE (MONTHS)</label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="text-input boxed-input"
                style={{ color: '#fff', background: 'rgba(255,255,255,0.08)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Estimated Monthly EMI</span>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 800, color: '#60a5fa', margin: '8px 0' }}>
            ₹{monthlyEmi.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 18 }}>
            Total Interest: <strong style={{ color: '#fff' }}>₹{totalInterest.toLocaleString('en-IN')}</strong>
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%' }}
            onClick={() => alert('Loan advisor will call you within 15 minutes!')}
          >
            Apply for Instant Loan
          </button>
        </div>
      </div>
    </section>
  );
}

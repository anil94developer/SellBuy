import { useState, useMemo } from 'react';

export function useEmiCalculatorViewModel() {
  const [loanAmount, setLoanAmount] = useState(600000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(48);

  const { monthlyEmi, totalInterest, totalPayable } = useMemo(() => {
    const p = parseFloat(loanAmount) || 0;
    const r = (parseFloat(interestRate) || 0) / 12 / 100;
    const n = parseFloat(tenureMonths) || 1;

    if (p <= 0 || r <= 0) return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0 };

    const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const total = Math.round(emi * n);
    const interest = Math.round(total - p);

    return {
      monthlyEmi: emi,
      totalInterest: interest,
      totalPayable: total
    };
  }, [loanAmount, interestRate, tenureMonths]);

  return {
    loanAmount,
    setLoanAmount,
    interestRate,
    setInterestRate,
    tenureMonths,
    setTenureMonths,
    monthlyEmi,
    totalInterest,
    totalPayable
  };
}

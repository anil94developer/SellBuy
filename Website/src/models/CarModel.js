// Website Model: Car Entity Formatter & EMI Calculator
export class CarModel {
  static formatPrice(price) {
    if (!price) return '₹ 0';
    return '₹ ' + Number(price).toLocaleString('en-IN');
  }

  static formatKm(km) {
    if (!km && km !== 0) return '0 km';
    return Number(km).toLocaleString('en-IN') + ' km';
  }

  static getFallbackImage(url) {
    return url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
  }

  // Calculate Monthly EMI: P * r * (1+r)^n / ((1+r)^n - 1)
  static calculateEmi(principal, annualRate = 9.5, tenureYears = 5) {
    const p = Number(principal) || 0;
    if (p <= 0) return { monthlyEmi: 0, totalInterest: 0, totalPayable: 0 };
    const r = (annualRate / 12) / 100;
    const n = tenureYears * 12;
    const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayable = emi * n;
    const totalInterest = totalPayable - p;
    return {
      monthlyEmi: emi,
      totalInterest,
      totalPayable
    };
  }
}

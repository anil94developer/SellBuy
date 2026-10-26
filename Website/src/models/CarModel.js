// Website Model: Car Entity Formatter
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

  // Dynamic Time-Ago Formatter (e.g., "Just now", "2 hours ago", "Yesterday", "5 days ago")
  static formatTimeAgo(dateString) {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }

  // Card Badge Time Formatter (OLX style: "TODAY", "YESTERDAY", "3 DAYS AGO", etc.)
  static formatCardTime(dateString) {
    if (!dateString) return 'RECENT';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'RECENT';

    const now = new Date();
    const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

    if (diffSec < 3600 * 24) return 'TODAY';
    const diffDays = Math.floor(diffSec / (3600 * 24));
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays < 7) return `${diffDays} DAYS AGO`;
    if (diffDays < 30) {
      const w = Math.floor(diffDays / 7);
      return `${w} WEEK${w > 1 ? 'S' : ''} AGO`;
    }
    const m = Math.floor(diffDays / 30);
    return `${m} MONTH${m > 1 ? 'S' : ''} AGO`;
  }
}


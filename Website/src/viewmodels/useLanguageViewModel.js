import { useState, useCallback } from 'react';

const dictionary = {
  en: {
    appName: "SellBuy",
    tagline: "Buy · Sell · Drive",
    buyCar: "Buy Car",
    sellCar: "Sell Car",
    popularBrands: "Popular Brands",
    featuredCars: "Featured Cars",
    certified: "Certified",
    used: "Used",
    new: "New",
    all: "All",
    searchPlaceholder: "Search by brand, model or keyword...",
    searchButton: "Search Cars",
    emiTitle: "Estimate Your Monthly Car Loan EMI",
    viewDetails: "View Details"
  },
  hi: {
    appName: "सेल-बाय (SellBuy)",
    tagline: "खरीदें · बेचें · ड्राइव करें",
    buyCar: "कार खरीदें",
    sellCar: "कार बेचें",
    popularBrands: "लोकप्रिय ब्रांड्स",
    featuredCars: "प्रमुख कारें",
    certified: "सत्यापित",
    used: "पुरानी",
    new: "नई",
    all: "सभी",
    searchPlaceholder: "ब्रांड, मॉडल या कीवर्ड से खोजें...",
    searchButton: "कार खोजें",
    emiTitle: "अपनी मासिक कार लोन EMI का अनुमान लगाएं",
    viewDetails: "विवरण देखें"
  }
};

export function useLanguageViewModel() {
  const [lang, setLang] = useState('en');

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  const t = useCallback((key) => {
    return dictionary[lang]?.[key] || dictionary['en']?.[key] || key;
  }, [lang]);

  return { lang, toggleLang, t };
}

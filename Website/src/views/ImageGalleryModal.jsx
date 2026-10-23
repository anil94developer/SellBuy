import React, { useState, useEffect } from 'react';

export function ImageGalleryModal({ car, onClose }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => (i === images.length - 1 ? 0 : i + 1));
      if (e.key === 'ArrowLeft') setIndex(i => (i === 0 ? images.length - 1 : i - 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!car) return null;

  const images = (car.images && car.images.length > 0)
    ? car.images
    : [car.primary_image || car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'];

  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="gallery-lightbox-overlay" onClick={onClose}>
      <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Top bar with Title, Counter, and Close */}
        <div className="gallery-lightbox-topbar">
          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: 16 }}>{car.title}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              Photo {index + 1} of {images.length}
            </div>
          </div>
          <button className="gallery-lightbox-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Main image stage with Prev/Next buttons */}
        <div className="gallery-lightbox-stage">
          <button className="gallery-stage-btn prev" onClick={prev}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <img
            src={images[index]}
            alt={car.title}
            className="gallery-stage-image"
          />

          <button className="gallery-stage-btn next" onClick={next}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {/* Bottom thumbnail strip */}
        <div className="gallery-lightbox-thumbs">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              className={`gallery-lightbox-thumb ${index === idx ? 'active' : ''}`}
              onClick={() => setIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

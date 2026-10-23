import React, { useState, useRef } from 'react';
import { AdminApiService } from '../models/AdminApiService';

/**
 * High-performance Admin Image Picker Component
 * Replaces manual URL typing with interactive file selection, drag-and-drop,
 * instant preview, backend upload (/api/upload), and stock presets.
 */
export function AdminImagePicker({
  value,
  onChange,
  multiple = false,
  label = 'Upload Image',
  hint = 'Supports PNG, JPG, WEBP (Max 10MB)',
  compact = false,
  aspectRatio = '16/9'
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Curated stock presets for instant 1-click test fill
  const STOCK_PRESETS = [
    { title: 'Hyundai Creta', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
    { title: 'Mahindra Thar', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' },
    { title: 'Toyota Fortuner', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80' },
    { title: 'Maruti Swift', url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80' },
    { title: 'BMW 3-Series', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' },
    { title: 'Electric EV', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' },
    { title: 'Promo Hero Banner', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Festival Strip Banner', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Upload a single file to /api/upload
  const uploadFile = async (file) => {
    try {
      setIsUploading(true);
      const res = await AdminApiService.uploadImage(file);
      if (res && res.success && res.url) {
        return res.url;
      }
    } catch (err) {
      console.warn('Backend upload failed, falling back to local object URL:', err);
    } finally {
      setIsUploading(false);
    }
    // Fallback to FileReader base64/blob URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  // Handle files selected from input or drag
  const handleFiles = async (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList);

    if (multiple) {
      const currentList = Array.isArray(value) ? [...value] : (value ? [value] : []);
      setIsUploading(true);
      for (const file of files) {
        const uploadedUrl = await uploadFile(file);
        currentList.push(uploadedUrl);
      }
      setIsUploading(false);
      onChange(currentList);
    } else {
      const uploadedUrl = await uploadFile(files[0]);
      onChange(uploadedUrl);
    }
  };

  const onFileInputChange = (e) => {
    handleFiles(e.target.files);
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeSingleImage = () => {
    onChange('');
  };

  const removeMultiImage = (indexToRemove) => {
    if (!Array.isArray(value)) return;
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // -------------------------------------------------------------
  // MULTIPLE IMAGES MODE (e.g. Add Car Inventory)
  // -------------------------------------------------------------
  if (multiple) {
    const imagesList = Array.isArray(value) ? value : (value ? [value] : []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label} ({imagesList.length} Selected)
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i> Preset Gallery
            </button>
          </div>
        </div>

        {/* Gallery Presets Drawer */}
        {showPresets && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
              gap: 8,
              background: '#0d131f',
              padding: 10,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {STOCK_PRESETS.map((p, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onChange([...imagesList, p.url]);
                }}
                style={{
                  cursor: 'pointer',
                  borderRadius: 6,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative'
                }}
                title={p.title}
              >
                <img src={p.url} alt={p.title} style={{ width: '100%', height: 60, objectFit: 'cover' }} />
                <div style={{ fontSize: 10, padding: '2px 4px', background: '#1e293b', color: '#cbd5e1', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  + {p.title}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Images Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {imagesList.map((img, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: 10,
                overflow: 'hidden',
                border: idx === 0 ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.12)',
                background: '#1e293b'
              }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {idx === 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    textTransform: 'uppercase'
                  }}
                >
                  Primary Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeMultiImage(idx)}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.85)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  transition: 'background 0.2s'
                }}
                title="Remove photo"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add slot */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              aspectRatio: '4/3',
              borderRadius: 10,
              border: `2px dashed ${isDragging ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`,
              background: isDragging ? 'rgba(59, 130, 246, 0.1)' : '#1e293b80',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            {isUploading ? (
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 20, color: '#3b82f6' }}></i>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 22, color: '#60a5fa' }}></i>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>+ Add Photo</span>
              </>
            )}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileInputChange}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: 11, color: '#94a3b8' }}>{hint}</div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // COMPACT LOGO / ICON MODE (e.g. Brand Logo)
  // -------------------------------------------------------------
  if (compact) {
    const isImage = value && (value.startsWith('http') || value.startsWith('/uploads') || value.startsWith('data:'));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              border: '1.5px dashed rgba(255,255,255,0.25)',
              background: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
            title="Click to pick logo image"
          >
            {isImage ? (
              <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 24 }}>{value || '🚗'}</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="admin-action-pill-btn secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '6px 12px' }}
            >
              <i className="fa-solid fa-folder-open"></i> Pick File
            </button>
            {['🚗', '🚙', '🏎️', '⚡', '👑', '🚐'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onChange(emoji)}
                style={{
                  background: value === emoji ? 'rgba(59, 130, 246, 0.3)' : '#1e293b',
                  border: value === emoji ? '1.5px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 16,
                  cursor: 'pointer'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileInputChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // SINGLE IMAGE MODE (e.g. Banners, Hero, Blog, Cover)
  // -------------------------------------------------------------
  const hasValue = Boolean(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i> Stock Gallery
        </button>
      </div>

      {/* Stock Presets */}
      {showPresets && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: 8,
            background: '#0d131f',
            padding: 10,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {STOCK_PRESETS.map((p, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(p.url);
                setShowPresets(false);
              }}
              style={{
                cursor: 'pointer',
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative'
              }}
              title={p.title}
            >
              <img src={p.url} alt={p.title} style={{ width: '100%', height: 60, objectFit: 'cover' }} />
              <div style={{ fontSize: 10, padding: '2px 4px', background: '#1e293b', color: '#cbd5e1', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.title}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone / Preview */}
      {hasValue ? (
        <div
          style={{
            position: 'relative',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1.5px solid rgba(255,255,255,0.15)',
            background: '#090d16',
            aspectRatio: aspectRatio,
            maxHeight: 240,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Action overlay bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '10px 14px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600 }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginRight: 4 }}></i> Image Ready
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="admin-action-pill-btn secondary"
                style={{ padding: '4px 10px' }}
              >
                <i className="fa-solid fa-camera"></i> Change Photo
              </button>
              <button
                type="button"
                onClick={removeSingleImage}
                className="admin-action-pill-btn danger"
                style={{ padding: '4px 10px' }}
              >
                <i className="fa-solid fa-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            borderRadius: 12,
            border: `2px dashed ${isDragging ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`,
            background: isDragging ? 'rgba(59, 130, 246, 0.1)' : '#1e293b40',
            padding: '28px 16px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
        >
          {isUploading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 28, color: '#3b82f6' }}></i>
              <span style={{ fontSize: 13, color: '#93c5fd', fontWeight: 600 }}>Uploading image to server...</span>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20
                }}
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div>
                <strong style={{ color: '#f8fafc', fontSize: 13 }}>Click to browse file or Drag & Drop</strong>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{hint}</div>
              </div>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
}

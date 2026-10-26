import React, { useState, useRef, useEffect } from 'react';

const BUYER_SUGGESTIONS = [
  'Hi, is this car still available?',
  'What is your best / final price?',
  'Can I take a test drive tomorrow?',
  'Are service records available?',
  'Is RC & Insurance transferable?',
  'Can we meet for physical inspection?'
];

const SELLER_SUGGESTIONS = [
  'Yes, the car is available for inspection.',
  'Price is slightly negotiable on table.',
  'Yes, test drive is available today.',
  'Complete authorized showroom service history available.',
  'RC transfer support will be provided.',
  'Let me know what time works best for you.'
];

export function ChatModal({
  isOpen,
  onClose,
  conversations = [],
  activeConversation,
  setActiveConversation,
  onSendMessage,
  onSelectCar,
  currentUser,
  userListings = [],
  onTyping,
  isSocketConnected = false,
  typingStatus = {}
}) {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'buying' | 'selling' | 'unread'
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false); // for responsive mobile view

  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Helper to determine if current user is seller in this conversation
  const isSellingConv = (conv) => {
    if (!conv) return false;
    if (conv.mode === 'selling' || conv.isSeller) return true;
    if (currentUser && (conv.sellerName === currentUser.name || conv.sellerPhone === currentUser.phone)) return true;
    if (userListings.some(l => String(l.id) === String(conv.carId))) return true;
    return false;
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages, isSellerTyping]);

  if (!isOpen) return null;

  const current = activeConversation || conversations[0];
  const isCurrentSelling = isSellingConv(current);
  const activeSuggestions = isCurrentSelling ? SELLER_SUGGESTIONS : BUYER_SUGGESTIONS;

  // Real-time socket typing state
  const currentChatTyping = current ? typingStatus[String(current.id)] : null;
  const isPeerTyping = Boolean(currentChatTyping?.isTyping && String(currentChatTyping?.senderId) !== String(currentUser?.id)) || isSellerTyping;
  const typingSenderName = currentChatTyping?.senderName || (isCurrentSelling ? (current?.buyerName || 'Buyer') : (current?.sellerName || 'Seller'));

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const matchesSearch =
      (c.sellerName && c.sellerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.carTitle && c.carTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));

    const isSelling = isSellingConv(c);

    if (filterTab === 'buying') {
      return matchesSearch && !isSelling;
    }
    if (filterTab === 'selling') {
      return matchesSearch && isSelling;
    }
    if (filterTab === 'unread') {
      return matchesSearch && (c.unreadCount > 0);
    }
    return matchesSearch;
  });

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (onTyping && current) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (onTyping) onTyping(false);

    const textToSend = inputText.trim();
    setInputText('');
    setShowAttachMenu(false);
    onSendMessage(textToSend);

    // Simulate seller typing indicator for realistic UX if not connected
    if (!isSocketConnected) {
      setIsSellerTyping(true);
      setTimeout(() => {
        setIsSellerTyping(false);
      }, 1200);
    }
  };

  const handleQuickReply = (text) => {
    onSendMessage(text);
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  const handleSendOffer = () => {
    if (!offerAmount) return;
    const formattedOffer = Number(offerAmount).toLocaleString('en-IN');
    const offerMessage = `🏷️ OFFICIAL PRICE OFFER: I would like to offer ₹${formattedOffer} for your vehicle. Please let me know if this works for you.`;
    onSendMessage(offerMessage);
    setShowOfferDrawer(false);
    setOfferAmount('');
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  const handleRequestTestDrive = () => {
    const msg = `🚗 TEST DRIVE REQUEST: I'd like to schedule a physical inspection and test drive for tomorrow at 3:00 PM. Please share your exact location.`;
    onSendMessage(msg);
    setShowAttachMenu(false);
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  const handleRequestDocs = () => {
    const msg = `📄 DOCUMENTATION INQUIRY: Could you please share details on RC validity, insurance type, and if any active loans or hypothecation are pending?`;
    onSendMessage(msg);
    setShowAttachMenu(false);
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  // Helper for quick offer discount chips
  const rawPrice = current ? parseInt(String(current.carPrice).replace(/[^0-9]/g, '')) || 1000000 : 1000000;
  const quickOffers = [
    { label: '-₹25,000', value: Math.max(100000, rawPrice - 25000) },
    { label: '-₹50,000', value: Math.max(100000, rawPrice - 50000) },
    { label: '-₹75,000', value: Math.max(100000, rawPrice - 75000) }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* =========================================================
            LEFT COLUMN: THREADS & CONVERSATIONS HUB (OLX STYLE)
            ========================================================= */}
        <div className={`chat-sidebar-threads ${mobileShowChat ? 'hide-on-mobile-view' : ''}`}>
          {/* Header */}
          <div className="chat-sidebar-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-comments" style={{ color: 'var(--primary)', fontSize: 20 }}></i>
                <h3 className="chat-sidebar-title">Chats</h3>
                <span className="chat-count-pill">{conversations.length}</span>
              </div>
              <button className="chat-close-btn-mobile hide-on-desktop" onClick={onClose} title="Close">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Conversation Search Bar */}
            <div className="chat-search-input-wrap">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search chats, sellers or cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="chat-search-input"
              />
              {searchQuery && (
                <button className="chat-search-clear" onClick={() => setSearchQuery('')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Filter Tabs (All / Buying / Selling / Unread) */}
            <div className="chat-filter-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, padding: '4px' }}>
              <button
                className={`chat-filter-tab ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
                style={{ fontSize: 11, padding: '5px 4px' }}
              >
                All ({conversations.length})
              </button>
              <button
                className={`chat-filter-tab ${filterTab === 'buying' ? 'active' : ''}`}
                onClick={() => setFilterTab('buying')}
                style={{ fontSize: 11, padding: '5px 4px', color: filterTab === 'buying' ? '#fff' : '#0284c7' }}
              >
                Buying
              </button>
              <button
                className={`chat-filter-tab ${filterTab === 'selling' ? 'active' : ''}`}
                onClick={() => setFilterTab('selling')}
                style={{ fontSize: 11, padding: '5px 4px', color: filterTab === 'selling' ? '#fff' : '#16a34a' }}
              >
                Selling
              </button>
              <button
                className={`chat-filter-tab ${filterTab === 'unread' ? 'active' : ''}`}
                onClick={() => setFilterTab('unread')}
                style={{ fontSize: 11, padding: '5px 4px' }}
              >
                Unread
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="chat-threads-list">
            {filteredConversations.length === 0 ? (
              <div className="chat-threads-empty">
                <i className="fa-regular fa-comment-dots" style={{ fontSize: 32, color: '#94a3b8', marginBottom: 8 }}></i>
                <p>No conversations found</p>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  {filterTab === 'selling' ? 'Buyer inquiries on your listed cars will appear here.' : 'Seller chats will appear here.'}
                </div>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isActive = current && current.id === c.id;
                const isSelling = isSellingConv(c);
                const threadPartnerName = isSelling ? (c.buyerName || 'Buyer') : (c.sellerName || 'Verified Seller');
                const threadPartnerAvatar = isSelling ? (c.buyerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80') : (c.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80');

                return (
                  <div
                    key={c.id}
                    className={`chat-thread-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveConversation(c);
                      setMobileShowChat(true);
                      setShowOfferDrawer(false);
                    }}
                  >
                    {/* Avatar with Online Green Dot */}
                    <div className="chat-thread-avatar-wrap">
                      <img
                        src={threadPartnerAvatar}
                        alt={threadPartnerName}
                        className="chat-thread-avatar"
                      />
                      {c.isOnline && <span className="chat-online-pulse"></span>}
                    </div>

                    {/* Thread Info */}
                    <div className="chat-thread-info">
                      <div className="chat-thread-top-line">
                        <span className="chat-thread-name">{threadPartnerName}</span>
                        <span className="chat-thread-time">{c.lastMessageTime || 'Just now'}</span>
                      </div>

                      {/* Mode Badge & Linked Car Pill */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 3 }}>
                        <span style={{
                          fontSize: 9.5,
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: 6,
                          background: isSelling ? 'rgba(22, 163, 74, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                          color: isSelling ? '#16a34a' : '#0284c7',
                          border: `1px solid ${isSelling ? 'rgba(22, 163, 74, 0.25)' : 'rgba(2, 132, 199, 0.25)'}`
                        }}>
                          {isSelling ? '🚗 Selling Lead' : '🛒 Buying'}
                        </span>

                        {c.carTitle && (
                          <div className="chat-thread-car-pill" style={{ margin: 0 }}>
                            <span>{c.carTitle}</span>
                          </div>
                        )}
                      </div>

                      {/* Last Message Preview & Unread Badge */}
                      <div className="chat-thread-bottom-line">
                        <span className="chat-thread-preview">
                          <i className="fa-solid fa-check-double" style={{ fontSize: 10, marginRight: 4, color: '#38bdf8' }}></i>
                          {c.lastMessage || 'Vehicle inquiry'}
                        </span>
                        {c.unreadCount > 0 && (
                          <span className="chat-unread-badge">{c.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: ACTIVE CHAT THREAD MAIN STAGE
            ========================================================= */}
        <div className={`chat-main-stage ${!mobileShowChat ? 'hide-on-mobile-view' : ''}`}>
          {current ? (
            <>
              {/* 1. Active Chat Header */}
              <div className="chat-active-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Mobile Back Button */}
                  <button
                    className="chat-mobile-back-btn hide-on-desktop"
                    onClick={() => setMobileShowChat(false)}
                    title="Back to conversation list"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>

                  <div className="chat-header-avatar-wrap">
                    <img
                      src={isCurrentSelling ? (current.buyerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80') : (current.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80')}
                      alt={isCurrentSelling ? (current.buyerName || 'Buyer') : (current.sellerName || 'Seller')}
                      className="chat-header-avatar"
                    />
                    {current.isOnline && <span className="chat-online-dot"></span>}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h4 className="chat-header-name">{isCurrentSelling ? (current.buyerName || 'Buyer') : (current.sellerName || 'Verified Seller')}</h4>
                      <span className="chat-seller-badge">
                        <i className="fa-solid fa-circle-check"></i> {isCurrentSelling ? 'Verified Buyer' : (current.verifiedBadge || 'Verified Seller')}
                      </span>
                    </div>
                    <div className="chat-header-sub">
                      <span className="chat-status-active">
                        <span className="status-dot" style={{ background: isSocketConnected ? '#10b981' : '#f59e0b' }}></span>
                        {isSocketConnected ? 'Real-Time Socket Connected' : 'Syncing...'}
                      </span>
                      <span>•</span>
                      <span>{current.carLocation || current.location || 'Jaipur'}</span>
                      {current.rating && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#eab308', fontWeight: 800 }}>★ {current.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons (WhatsApp, Phone Call & Close) */}
                <div className="chat-header-actions">
                  <a
                    href={`https://wa.me/91${((isCurrentSelling ? current.buyerPhone : current.sellerPhone) || '9876543210').replace(/[^0-9]/g, '').slice(-10)}?text=Hi%20${encodeURIComponent(isCurrentSelling ? (current.buyerName || 'there') : (current.sellerName || 'there'))},%20regarding%20${encodeURIComponent(current.carTitle)}%20on%20SellBuy.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chat-whatsapp-btn"
                    title="Chat on WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span className="hide-on-tablet">WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${current.sellerPhone || '+919876543210'}`}
                    className="chat-call-btn"
                    title="Call Seller directly"
                  >
                    <i className="fa-solid fa-phone"></i>
                    <span className="hide-on-tablet">Call</span>
                  </a>

                  <button className="chat-header-close-btn" onClick={onClose} title="Close Chat">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              {/* 2. Pinned Linked Car Banner (OLX style) */}
              {current.carTitle && (
                <div className="chat-car-banner">
                  <div className="chat-car-banner-left" onClick={() => { onClose(); onSelectCar(current.carId); }}>
                    <img
                      src={current.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                      alt={current.carTitle}
                      className="chat-car-banner-thumb"
                    />
                    <div className="chat-car-banner-meta">
                      <div className="chat-car-banner-title">{current.carTitle}</div>
                      <div className="chat-car-banner-price">{current.carPrice}</div>
                      {current.carSpecs && (
                        <div className="chat-car-banner-specs">{current.carSpecs}</div>
                      )}
                    </div>
                  </div>

                  <div className="chat-car-banner-actions">
                    <button
                      className="chat-offer-trigger-btn"
                      onClick={() => setShowOfferDrawer(!showOfferDrawer)}
                    >
                      <i className="fa-solid fa-tag"></i>
                      <span>{showOfferDrawer ? 'Close Offer' : 'Make an Offer'}</span>
                    </button>

                    <button
                      className="chat-view-car-btn"
                      onClick={() => { onClose(); onSelectCar(current.carId); }}
                    >
                      <span>View Details</span>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Interactive "Make an Offer" Drawer */}
              {showOfferDrawer && (
                <div className="chat-offer-drawer">
                  <div className="chat-offer-drawer-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', letterSpacing: 0.5 }}>
                          PROPOSE DIRECT OFFER
                        </span>
                        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                          Make an Offer to {current.sellerName}
                        </h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>Listed Price</span>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{current.carPrice}</div>
                      </div>
                    </div>

                    {/* Quick discount chips */}
                    <div className="chat-offer-quick-pills">
                      {quickOffers.map((o, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="chat-offer-pill"
                          onClick={() => setOfferAmount(String(o.value))}
                        >
                          {o.label} (₹{o.value.toLocaleString('en-IN')})
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <div className="chat-offer-input-wrap">
                        <span className="chat-offer-currency">₹</span>
                        <input
                          type="number"
                          placeholder="Enter your offer amount (e.g. 1100000)"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                          className="chat-offer-input"
                        />
                      </div>
                      <button
                        className="chat-offer-submit-btn"
                        onClick={handleSendOffer}
                        disabled={!offerAmount}
                      >
                        Send Offer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Messages History Window */}
              <div className="chat-messages-container">
                {/* Safety Advisory Banner */}
                <div className="chat-safety-pill">
                  <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a' }}></i>
                  <span>SellBuy Buyer Protection: Inspect the vehicle thoroughly & verify RC documents before making any payment.</span>
                </div>

                <div className="chat-date-separator">
                  <span>TODAY</span>
                </div>

                {(current.messages || []).map((msg) => {
                  const isOfferMsg = msg.text.includes('OFFICIAL PRICE OFFER');
                  const isTestDriveMsg = msg.text.includes('TEST DRIVE REQUEST');
                  const isDocsMsg = msg.text.includes('DOCUMENTATION INQUIRY');

                  return (
                    <div
                      key={msg.id}
                      className={`chat-bubble-row ${msg.isMe ? 'me' : 'seller'}`}
                    >
                      {!msg.isMe && (
                        <img
                          src={current.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="chat-bubble-avatar"
                        />
                      )}

                      <div className={`chat-bubble ${msg.isMe ? 'me' : 'seller'}`}>
                        {/* Special Rich Card for Offers */}
                        {isOfferMsg ? (
                          <div className="chat-special-card offer">
                            <div className="special-card-header">
                              <i className="fa-solid fa-tag"></i>
                              <span>PRICE OFFER</span>
                            </div>
                            <div className="special-card-body">
                              {msg.text}
                            </div>
                            <div className="special-card-status">
                              <i className="fa-solid fa-clock"></i> Status: Under Seller Review
                            </div>
                          </div>
                        ) : isTestDriveMsg ? (
                          <div className="chat-special-card testdrive">
                            <div className="special-card-header">
                              <i className="fa-solid fa-car-side"></i>
                              <span>TEST DRIVE SCHEDULE</span>
                            </div>
                            <div className="special-card-body">
                              {msg.text}
                            </div>
                          </div>
                        ) : isDocsMsg ? (
                          <div className="chat-special-card docs">
                            <div className="special-card-header">
                              <i className="fa-solid fa-file-shield"></i>
                              <span>DOCUMENTATION CHECK</span>
                            </div>
                            <div className="special-card-body">
                              {msg.text}
                            </div>
                          </div>
                        ) : (
                          <div className="chat-bubble-text">{msg.text}</div>
                        )}

                        <div className="chat-bubble-footer">
                          <span className="chat-bubble-time">{msg.time || 'Just now'}</span>
                          {msg.isMe && (
                            <i className="fa-solid fa-check-double chat-bubble-check" title="Delivered & Read"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Real-time typing bubble */}
                {isPeerTyping && (
                  <div className="chat-bubble-row seller">
                    <img
                      src={isCurrentSelling ? (current.buyerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80') : (current.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80')}
                      alt=""
                      className="chat-bubble-avatar"
                    />
                    <div className="chat-bubble seller typing">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>
                        {typingSenderName?.split(' ')[0]} is typing...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 5. Quick Suggestion Reply Chips */}
              <div className="chat-quick-replies-row">
                {activeSuggestions.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chat-quick-chip"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* 6. Attachment / Action Menu Popup */}
              {showAttachMenu && (
                <div className="chat-attachment-menu">
                  <button className="chat-attach-item" onClick={() => { setShowAttachMenu(false); setShowOfferDrawer(true); }}>
                    <i className="fa-solid fa-tag" style={{ color: '#2563eb' }}></i>
                    <div>
                      <strong>Make an Offer</strong>
                      <span>Propose a direct price offer</span>
                    </div>
                  </button>

                  <button className="chat-attach-item" onClick={handleRequestTestDrive}>
                    <i className="fa-solid fa-car-side" style={{ color: '#16a34a' }}></i>
                    <div>
                      <strong>Schedule Test Drive</strong>
                      <span>Request a physical appointment</span>
                    </div>
                  </button>

                  <button className="chat-attach-item" onClick={handleRequestDocs}>
                    <i className="fa-solid fa-file-contract" style={{ color: '#f59e0b' }}></i>
                    <div>
                      <strong>Verify Documents</strong>
                      <span>Request RC & Insurance proof</span>
                    </div>
                  </button>
                </div>
              )}

              {/* 7. Bottom Input Bar */}
              <form onSubmit={handleSend} className="chat-input-bar">
                <button
                  type="button"
                  className={`chat-action-menu-toggle ${showAttachMenu ? 'active' : ''}`}
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  title="Quick Vehicle Actions (Offer, Test Drive, Docs)"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>

                <input
                  type="text"
                  placeholder={`Type a message to ${isCurrentSelling ? (current.buyerName?.split(' ')[0] || 'Buyer') : (current.sellerName?.split(' ')[0] || 'Seller')}...`}
                  className="chat-text-input"
                  value={inputText}
                  onChange={handleInputChange}
                  autoFocus
                />

                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!inputText.trim()}
                  title="Send Message"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </>
          ) : (
            <div className="chat-no-selection-screen">
              <div className="chat-no-selection-icon">
                <i className="fa-solid fa-comments"></i>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                Your Messages Hub
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', maxWidth: 360, margin: '0 auto' }}>
                Select any conversation on the left to negotiate price, ask for inspection, or book a test drive.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

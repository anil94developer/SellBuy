import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { Conversation, ChatMessage } from '../../models/chat.model';
import { colors, typography, shadows } from '../../theme/theme';
import { ImagePickerModal } from '../components/ImagePickerModal';

interface Props {
  conversation: Conversation;
  conversations?: Conversation[];
  onBack: () => void;
  onSendMessage: (text: string, images?: string[]) => void;
  onSelectConversation?: (conversationId: string) => void;
  onViewCarDetails?: (carId: string) => void;
}

const QUICK_REPLIES = [
  'Hi, is this car still available?',
  'What is your final price?',
  'Can I take a test drive tomorrow?',
  'Are service records available?',
  'Is RC transfer included?',
];

export const ChatScreen: React.FC<Props> = ({
  conversation,
  conversations = [],
  onBack,
  onSendMessage,
  onSelectConversation,
  onViewCarDetails,
}) => {
  // If conversations array is passed and has more than 1 item, allow switching
  const allConversations = conversations.length > 0 ? conversations : [conversation];

  // Screen View: 'thread' (chatting with active person) or 'inbox' (list of all people)
  const [viewMode, setViewMode] = useState<'thread' | 'inbox'>('thread');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerInput, setOfferInput] = useState('');
  const [isSellerTyping, setIsSellerTyping] = useState(false);

  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 120);
  }, [conversation?.messages?.length, isSellerTyping]);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);

    // Simulate seller typing response
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  const handleSendQuickReply = (reply: string) => {
    onSendMessage(reply);
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  const handleSendImage = (imageUri: string, caption?: string) => {
    const textMsg = caption ? caption : '📷 [Attached Photo]';
    onSendMessage(textMsg, [imageUri]);
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  const handleSendOffer = () => {
    if (!offerInput.trim()) return;
    const formatted = Number(offerInput).toLocaleString('en-IN');
    const msg = `🏷️ PRICE OFFER: I am offering ₹${formatted} for this car. Please let me know if you can accept.`;
    onSendMessage(msg);
    setShowOfferModal(false);
    setOfferInput('');
    setIsSellerTyping(true);
    setTimeout(() => {
      setIsSellerTyping(false);
    }, 1200);
  };

  const handleCall = () => {
    Alert.alert(
      'Calling Seller',
      `Dialing ${conversation.sellerPhone || '+91 98765-43210'} (${conversation.sellerName})...`
    );
  };

  // Filter conversations for the Inbox list
  const filteredConversations = allConversations.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.sellerName.toLowerCase().includes(query) ||
      c.carTitle.toLowerCase().includes(query) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(query))
    );
  });

  // =========================================================================
  // VIEW 1: INBOX LIST (MULTIPLE PERSONS CHAT LIST)
  // =========================================================================
  if (viewMode === 'inbox') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Inbox Header */}
        <View style={styles.inboxHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.inboxTitleBox}>
            <Text style={styles.inboxTitle}>Messages</Text>
            <Text style={styles.inboxSubtitle}>
              {allConversations.length} Active Conversations
            </Text>
          </View>
          <View style={styles.inboxBadgeCount}>
            <Text style={styles.inboxBadgeText}>{allConversations.length}</Text>
          </View>
        </View>

        {/* Search People or Cars */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search seller or car model..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Conversation List */}
        <ScrollView style={styles.inboxList} showsVerticalScrollIndicator={false}>
          {filteredConversations.map((item) => {
            const isCurrent = item.id === conversation.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.inboxItem, isCurrent && styles.inboxItemActive]}
                onPress={() => {
                  if (onSelectConversation) onSelectConversation(item.id);
                  setViewMode('thread');
                }}
                activeOpacity={0.75}>
                {/* Person Avatar with Online dot */}
                <View style={styles.avatarWrap}>
                  <Image
                    source={{
                      uri:
                        item.sellerAvatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                    }}
                    style={styles.inboxAvatar}
                  />
                  {item.isOnline && <View style={styles.onlineBadge} />}
                </View>

                {/* Conversation Details */}
                <View style={styles.inboxDetails}>
                  <View style={styles.inboxTopRow}>
                    <Text style={styles.inboxName} numberOfLines={1}>
                      {item.sellerName}
                    </Text>
                    <Text style={styles.inboxTime}>{item.lastMessageTime || 'Today'}</Text>
                  </View>

                  {/* Car Badge */}
                  <View style={styles.inboxCarPill}>
                    <Text style={styles.inboxCarPillText} numberOfLines={1}>
                      🚗 {item.carTitle} • {item.carPrice}
                    </Text>
                  </View>

                  {/* Last Message Snippet */}
                  <View style={styles.inboxBottomRow}>
                    <Text style={styles.inboxLastMessage} numberOfLines={1}>
                      {item.lastMessage || 'Vehicle inquiry'}
                    </Text>
                    {item.unreadCount && item.unreadCount > 0 ? (
                      <View style={styles.unreadCountBadge}>
                        <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // VIEW 2: ACTIVE CHAT THREAD WITH CHOSEN PERSON
  // =========================================================================
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}>
        {/* Top Active Chat Header */}
        <View style={styles.header}>
          {/* Back button takes user back to Inbox */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setViewMode('inbox')}
            activeOpacity={0.7}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* Seller Avatar */}
          <TouchableOpacity
            style={styles.headerProfileClick}
            onPress={() => setViewMode('inbox')}
            activeOpacity={0.8}>
            <View style={styles.avatarWrap}>
              <Image
                source={{
                  uri:
                    conversation.sellerAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.avatar}
              />
              {conversation.isOnline && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.sellerName} numberOfLines={1}>
                  {conversation.sellerName}
                </Text>
                {conversation.sellerBadge && (
                  <View style={styles.verifiedTag}>
                    <Text style={styles.verifiedTagText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.onlineStatus}>
                {conversation.isOnline ? '● Online • Tap for all chats' : 'Offline'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Header Action Buttons (Inbox Switcher & Call) */}
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.inboxSwitchBtn}
              onPress={() => setViewMode('inbox')}
              activeOpacity={0.7}>
              <Text style={styles.inboxSwitchText}>👥 {allConversations.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.7}>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pinned Linked Car Context Banner */}
        <View style={styles.carBanner}>
          <TouchableOpacity
            style={styles.carBannerLeft}
            onPress={() => onViewCarDetails?.(conversation.carId)}
            activeOpacity={0.8}>
            <Image
              source={{
                uri:
                  conversation.carImage ||
                  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
              }}
              style={styles.carThumbnail}
            />
            <View style={styles.carBannerInfo}>
              <Text style={styles.carBannerTitle} numberOfLines={1}>
                {conversation.carTitle}
              </Text>
              <Text style={styles.carBannerPrice}>{conversation.carPrice}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.carBannerRight}>
            <TouchableOpacity
              style={styles.offerBtn}
              onPress={() => setShowOfferModal(true)}
              activeOpacity={0.75}>
              <Text style={styles.offerBtnText}>🏷️ Offer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewCarDetailsBtn}
              onPress={() => onViewCarDetails?.(conversation.carId)}
              activeOpacity={0.75}>
              <Text style={styles.viewCarText}>Details ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Thread Scroll Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          {/* Safety Banner */}
          <View style={styles.safetyCard}>
            <Text style={styles.safetyText}>
              🛡️ SellBuy Safe Trade: Never transfer advance deposit before in-person test drive.
            </Text>
          </View>

          {/* Messages */}
          {conversation.messages.map((msg: ChatMessage) => {
            const isOffer = msg.text.includes('PRICE OFFER');
            const hasImages = msg.images && msg.images.length > 0;

            return (
              <View
                key={msg.id}
                style={[styles.messageRow, msg.isMe ? styles.myMessageRow : styles.otherMessageRow]}>
                <View
                  style={[
                    styles.messageBubble,
                    msg.isMe ? styles.myBubble : styles.otherBubble,
                    isOffer && styles.offerBubble,
                  ]}>
                  {/* Attached Images */}
                  {hasImages && (
                    <View style={styles.imageGrid}>
                      {msg.images!.map((imgUri, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => setPreviewImage(imgUri)}
                          activeOpacity={0.9}
                          style={styles.chatImageWrap}>
                          <Image source={{ uri: imgUri }} style={styles.chatImage} />
                          <View style={styles.imageZoomBadge}>
                            <Text style={styles.imageZoomText}>🔍 Zoom</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Text Message Content */}
                  <Text style={[styles.messageText, msg.isMe ? styles.myMessageText : styles.otherMessageText]}>
                    {msg.text}
                  </Text>

                  {/* Timestamp & Double Check */}
                  <View style={styles.messageFooter}>
                    <Text style={[styles.messageTime, msg.isMe && styles.myTimeText]}>
                      {msg.time}
                    </Text>
                    {msg.isMe && <Text style={styles.checkIcon}>✓✓</Text>}
                  </View>
                </View>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {isSellerTyping && (
            <View style={[styles.messageRow, styles.otherMessageRow]}>
              <View style={[styles.messageBubble, styles.otherBubble, styles.typingBubble]}>
                <Text style={styles.typingText}>
                  💬 {conversation.sellerName.split(' ')[0]} is typing...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestion Chips */}
        <View style={styles.quickRepliesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
            {QUICK_REPLIES.map((reply, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickChip}
                onPress={() => handleSendQuickReply(reply)}
                activeOpacity={0.75}>
                <Text style={styles.quickChipText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Input Bar with Camera / Image Picker */}
        <View style={styles.inputContainer}>
          {/* Image Picker Trigger Button */}
          <TouchableOpacity
            style={styles.imagePickerBtn}
            onPress={() => setImagePickerVisible(true)}
            activeOpacity={0.7}>
            <Text style={styles.imagePickerIcon}>📷</Text>
          </TouchableOpacity>

          {/* Offer Trigger Icon */}
          <TouchableOpacity
            style={styles.tagBtn}
            onPress={() => setShowOfferModal(true)}
            activeOpacity={0.7}>
            <Text style={styles.tagIcon}>🏷️</Text>
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder={`Message ${conversation.sellerName.split(' ')[0]}...`}
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={colors.textMuted}
            multiline={false}
          />

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSendText}
            disabled={!inputText.trim()}
            activeOpacity={0.85}>
            <Text style={styles.sendIcon}>➔</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Reusable Image Picker Modal */}
      <ImagePickerModal
        visible={imagePickerVisible}
        onClose={() => setImagePickerVisible(false)}
        onSelectImage={handleSendImage}
        title="Send Photo to Seller"
        allowCaption={true}
      />

      {/* Make an Offer Modal */}
      <Modal visible={showOfferModal} transparent animationType="fade" onRequestClose={() => setShowOfferModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.offerCard}>
            <Text style={styles.offerTitle}>Make Price Offer 🏷️</Text>
            <Text style={styles.offerSubtitle}>
              Current price: {conversation.carPrice}. Enter your counter-offer.
            </Text>

            <View style={styles.offerInputWrap}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.offerInputField}
                placeholder="e.g. 1100000"
                keyboardType="numeric"
                value={offerInput}
                onChangeText={setOfferInput}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.offerActions}>
              <TouchableOpacity
                style={styles.offerCancelBtn}
                onPress={() => setShowOfferModal(false)}
                activeOpacity={0.7}>
                <Text style={styles.offerCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.offerSendBtn, !offerInput.trim() && styles.offerBtnDisabled]}
                onPress={handleSendOffer}
                disabled={!offerInput.trim()}
                activeOpacity={0.85}>
                <Text style={styles.offerSendText}>Send Offer ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Photo Zoom Modal */}
      <Modal visible={previewImage !== null} transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
        <View style={styles.fullscreenImageOverlay}>
          <TouchableOpacity
            style={styles.closeZoomBtn}
            onPress={() => setPreviewImage(null)}
            activeOpacity={0.7}>
            <Text style={styles.closeZoomText}>✕ Close</Text>
          </TouchableOpacity>
          {previewImage && (
            <Image source={{ uri: previewImage }} style={styles.fullscreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardContainer: {
    flex: 1,
  },

  /* ---------------- INBOX (MULTIPLE CHATS) STYLES ---------------- */
  inboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  inboxTitleBox: {
    flex: 1,
    marginLeft: 12,
  },
  inboxTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  inboxSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  inboxBadgeCount: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inboxBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  clearSearch: {
    fontSize: 14,
    color: colors.textMuted,
    padding: 4,
  },
  inboxList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  inboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  inboxItemActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  inboxAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  inboxDetails: {
    flex: 1,
    marginLeft: 12,
  },
  inboxTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inboxName: {
    fontSize: 15,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  inboxTime: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  inboxCarPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  inboxCarPillText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  inboxBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inboxLastMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadCountBadge: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* ---------------- ACTIVE THREAD STYLES ---------------- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  headerProfileClick: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  verifiedTag: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  verifiedTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  onlineStatus: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inboxSwitchBtn: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inboxSwitchText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: {
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  carBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  carBannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  carThumbnail: {
    width: 44,
    height: 36,
    borderRadius: 6,
    marginRight: 10,
  },
  carBannerInfo: {
    flex: 1,
  },
  carBannerTitle: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  carBannerPrice: {
    fontSize: 12,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  carBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offerBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  offerBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  viewCarDetailsBtn: {
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  viewCarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  safetyCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 8,
    marginBottom: 14,
  },
  safetyText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '600',
    textAlign: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: 14,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
    ...shadows.sm,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  offerBubble: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  myMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  otherMessageText: {
    color: colors.textPrimary,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 9,
    color: colors.textMuted,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  checkIcon: {
    fontSize: 9,
    color: '#93C5FD',
    marginLeft: 4,
    fontWeight: '800',
  },
  typingBubble: {
    backgroundColor: '#F1F5F9',
  },
  typingText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  /* Images inside Chat Bubble */
  imageGrid: {
    marginBottom: 6,
  },
  chatImageWrap: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  chatImage: {
    width: 220,
    height: 150,
    borderRadius: 10,
  },
  imageZoomBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  imageZoomText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  /* Quick Suggestion Chips */
  quickRepliesSection: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingVertical: 6,
  },
  quickScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  quickChip: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  quickChipText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  /* Bottom Input Bar */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 8,
  },
  imagePickerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imagePickerIcon: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  tagBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagIcon: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  textInput: {
    flex: 1,
    height: 42,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 21,
    paddingHorizontal: 14,
    fontSize: 13,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },

  /* Make an Offer Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...shadows.lg,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  offerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 6,
  },
  offerInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    height: 48,
    marginVertical: 14,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginRight: 6,
  },
  offerInputField: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  offerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  offerCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  offerSendBtn: {
    flex: 2,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  offerSendText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Fullscreen Zoom Modal */
  fullscreenImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeZoomBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    zIndex: 10,
  },
  closeZoomText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  fullscreenImage: {
    width: '94%',
    height: '75%',
  },
});

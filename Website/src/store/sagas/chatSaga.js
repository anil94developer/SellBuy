import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import { ApiService } from '../../models/ApiService';
import {
  sendMessageRequest,
  setConversations,
  setActiveConversation
} from '../slices/chatSlice';

const selectActiveConversation = (state) => state.chat.activeConversation;

function* sendMessageWorker(action) {
  try {
    const { conversationId, text } = action.payload;
    const res = yield call(ApiService.sendMessage, conversationId, text);
    if (res.success) {
      const convs = yield call(ApiService.getConversations);
      yield put(setConversations(convs));
      yield put(setActiveConversation(res.conversation));

      // Automatic seller reply simulation
      yield delay(1200);
      const activeConv = yield select(selectActiveConversation);
      if (activeConv && activeConv.id === conversationId) {
        const lower = text.toLowerCase();
        const replyText = lower.includes('price') || lower.includes('negotiat')
          ? 'Yes, slight negotiation is possible upon meeting in person. Let me know when you can visit.'
          : lower.includes('drive') || lower.includes('test')
          ? 'Sure, test drive is available today between 11 AM to 6 PM. Where are you located?'
          : 'Thank you for your interest! The car is available with complete service records.';

        const replyMsg = {
          id: 'm_reply_' + Date.now(),
          senderId: activeConv.sellerId,
          senderName: activeConv.sellerName,
          text: replyText,
          time: 'Just now',
          isMe: false
        };

        const updatedMessages = [...(activeConv.messages || []), replyMsg];
        const updatedConv = {
          ...activeConv,
          messages: updatedMessages,
          lastMessage: replyText,
          lastMessageTime: 'Just now'
        };

        const currentConvs = yield call(ApiService.getConversations);
        const mappedConvs = currentConvs.map(c => c.id === conversationId ? updatedConv : c);
        yield put(setConversations(mappedConvs));
        yield put(setActiveConversation(updatedConv));
      }
    }
  } catch (err) {
    console.error('sendMessageWorker error:', err);
  }
}

export function* chatSaga() {
  yield takeLatest(sendMessageRequest.type, sendMessageWorker);
}

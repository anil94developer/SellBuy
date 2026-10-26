import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import { ApiService } from '../../models/ApiService';
import {
  sendMessageRequest,
  setConversations,
  setActiveConversation
} from '../slices/chatSlice';

const selectActiveConversation = (state) => state.chat.activeConversation;
const selectCurrentUser = (state) => state.auth.currentUser;

function* sendMessageWorker(action) {
  try {
    const { conversationId, text } = action.payload;
    const currentUser = yield select(selectCurrentUser);
    const userId = currentUser ? currentUser.id : null;

    const res = yield call(ApiService.sendMessage, conversationId, userId, text);
    if (res && res.success) {
      const convs = yield call(ApiService.getConversations, userId);
      yield put(setConversations(convs));
      const activeConv = convs.find(c => String(c.id) === String(conversationId));
      if (activeConv) {
        yield put(setActiveConversation(activeConv));
      }

      // Check if seller is a different user / simulated seller
      const currentActive = yield select(selectActiveConversation);
      if (currentActive && currentActive.sellerId && String(currentActive.sellerId) !== String(userId)) {
        yield delay(1500);
        const lower = text.toLowerCase();
        const replyText = lower.includes('price') || lower.includes('negotiat')
          ? 'Yes, slight negotiation is possible upon meeting in person. Let me know when you can visit.'
          : lower.includes('drive') || lower.includes('test')
          ? 'Sure, test drive is available today between 11 AM to 6 PM. Where are you located?'
          : 'Thank you for your interest! The car is available with complete service records.';

        // Save seller reply to real database as well!
        yield call(ApiService.sendMessage, conversationId, currentActive.sellerId, replyText);
        const updatedConvs = yield call(ApiService.getConversations, userId);
        yield put(setConversations(updatedConvs));
        const updatedActive = updatedConvs.find(c => String(c.id) === String(conversationId));
        if (updatedActive) {
          yield put(setActiveConversation(updatedActive));
        }
      }
    }
  } catch (err) {
    console.error('sendMessageWorker error:', err);
  }
}

export function* chatSaga() {
  yield takeLatest(sendMessageRequest.type, sendMessageWorker);
}

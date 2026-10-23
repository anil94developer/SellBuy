const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../services/logger');

// Simulated active OTPs in memory
const activeOtps = new Map();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || String(phone).replace(/\D/g, '').length < 10) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const demoOtp = process.env.DEMO_OTP || '123456';
    activeOtps.set(cleanPhone, { otp: demoOtp, expiresAt: Date.now() + 60000 });

    logger.auth('OTP_SENT', `Sent 6-digit OTP to mobile +91 ${cleanPhone} (Demo OTP: ${demoOtp})`, {
      ip: req.ip
    });

    return res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      demoOtp, // Provided for effortless testing
      expiresIn: 60
    });
  } catch (err) {
    logger.error('AUTH', 'SEND_OTP_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const demoOtp = process.env.DEMO_OTP || '123456';

    const cached = activeOtps.get(cleanPhone);
    const isValid = otp === demoOtp || (cached && cached.otp === otp);

    if (!isValid) {
      logger.warn('AUTH', 'OTP_FAILED', `Invalid OTP entered for +91 ${cleanPhone}`);
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter 123456.' });
    }

    activeOtps.delete(cleanPhone);

    // Check if user exists in DB
    const existing = await query('SELECT * FROM users WHERE phone = ?', [cleanPhone]);
    
    if (existing && existing.length > 0) {
      const user = existing[0];
      if (user.status === 'blocked') {
        return res.status(403).json({ success: false, isBlocked: true, message: 'Your account is blocked. Contact administrator.' });
      }

      logger.auth('LOGIN_SUCCESS', `User logged in: ${user.name} (+91 ${cleanPhone})`, {
        userId: user.id,
        userName: user.name,
        ip: req.ip
      });

      return res.json({
        success: true,
        isNewUser: false,
        message: 'Login successful',
        user
      });
    } else {
      // New user registration needed
      logger.auth('OTP_VERIFIED_NEW_USER', `Verified new mobile +91 ${cleanPhone}, awaiting profile completion`);
      return res.json({
        success: true,
        isNewUser: true,
        phone: cleanPhone,
        message: 'OTP verified. Please complete your profile.'
      });
    }
  } catch (err) {
    logger.error('AUTH', 'VERIFY_OTP_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Profile Save & Update Handler (Registration & Edit Profile)
const handleProfileSave = async (req, res) => {
  try {
    const { phone, name, email, avatar } = req.body;
    const targetId = req.body.id || req.body.userId || req.headers['x-user-id'];

    let cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';

    let existing;
    if (targetId && targetId !== '0') {
      existing = await query('SELECT * FROM users WHERE id = ?', [targetId]);
      if (existing && existing.length > 0 && !cleanPhone) {
        cleanPhone = existing[0].phone;
      }
    }

    if ((!existing || existing.length === 0) && cleanPhone) {
      existing = await query('SELECT * FROM users WHERE phone = ?', [cleanPhone]);
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    if (!cleanPhone && (!existing || existing.length === 0)) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const userAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    let updatedUser;

    if (existing && existing.length > 0) {
      await query(
        'UPDATE users SET name = ?, email = ?, avatar = ?, status = "active" WHERE id = ?',
        [name.trim(), email ? email.trim() : existing[0].email, userAvatar, existing[0].id]
      );
      updatedUser = (await query('SELECT * FROM users WHERE id = ?', [existing[0].id]))[0];
    } else {
      const insertResult = await query(
        'INSERT INTO users (name, phone, email, avatar, role, is_verified, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name.trim(), cleanPhone, email ? email.trim() : null, userAvatar, 'customer', 1, 5.0, 'active']
      );
      updatedUser = (await query('SELECT * FROM users WHERE id = ?', [insertResult.insertId]))[0];
    }

    logger.auth('PROFILE_SAVED', `Profile saved: ${name.trim()} (Phone: ${updatedUser.phone})`, {
      userId: updatedUser.id,
      userName: updatedUser.name,
      ip: req.ip
    });

    return res.json({
      success: true,
      message: 'Profile saved successfully',
      user: updatedUser
    });
  } catch (err) {
    logger.error('AUTH', 'PROFILE_SAVE_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

router.post('/complete-profile', handleProfileSave);
router.post('/profile', handleProfileSave);
router.put('/profile', handleProfileSave);

// POST /api/auth/social-login
router.post('/social-login', async (req, res) => {
  try {
    const { provider } = req.body; // 'google' | 'apple'
    const name = provider === 'apple' ? 'Apple User' : 'Google User';
    const email = `${provider}_user@sellbuy.in`;
    const phone = provider === 'apple' ? '9870001122' : '9870003344';

    let user = (await query('SELECT * FROM users WHERE phone = ?', [phone]))[0];
    if (!user) {
      const result = await query(
        'INSERT INTO users (name, phone, email, avatar, role, is_verified, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, phone, email, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', 'customer', 1, 4.9, 'active']
      );
      user = (await query('SELECT * FROM users WHERE id = ?', [result.insertId]))[0];
    }

    if (user && user.status === 'blocked') {
      return res.status(403).json({ success: false, isBlocked: true, message: 'Your account is blocked. Contact administrator.' });
    }

    logger.auth('SOCIAL_LOGIN', `Social sign-in with ${provider ? provider.toUpperCase() : 'SSO'}: ${user.name}`, {
      userId: user.id,
      userName: user.name,
      ip: req.ip
    });

    return res.json({
      success: true,
      message: `Signed in with ${provider ? provider.toUpperCase() : 'SSO'}`,
      user
    });
  } catch (err) {
    logger.error('AUTH', 'SOCIAL_LOGIN_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/status/:id - Account status check for clients
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || id === 'null' || id === '0' || id === '') {
      return res.json({ success: true, isBlocked: false, isGuest: true, message: 'Guest session' });
    }

    const rows = await query('SELECT id, name, phone, status, role FROM users WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.json({ success: true, notFound: true, isBlocked: false, message: 'User not found' });
    }

    const user = rows[0];
    const isBlocked = user.status === 'blocked';

    return res.json({
      success: true,
      id: user.id,
      name: user.name,
      status: user.status,
      role: user.role,
      isBlocked,
      message: isBlocked ? 'Your account has been suspended by administrator.' : 'Account active'
    });
  } catch (err) {
    logger.error('AUTH', 'STATUS_CHECK_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT id, name, phone, email, avatar, role, rating, is_verified, status, created_at FROM users ORDER BY id ASC');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/switch-user
router.post('/switch-user', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = (await query('SELECT * FROM users WHERE id = ?', [userId]))[0];
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, isBlocked: true, message: 'Your account is blocked. Contact administrator.' });
    }

    logger.auth('USER_SWITCH', `Switched session to ${user.name} (${user.role})`, {
      userId: user.id,
      userName: user.name,
      ip: req.ip
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

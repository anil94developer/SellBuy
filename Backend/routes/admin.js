const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../services/logger');
const redisCache = require('../services/redisCache');

// GET /api/admin/stats (Cached in Redis for 30s)
router.get('/stats', redisCache.middleware('admin:stats', 30), async (req, res) => {
  try {
    const userCount = (await query('SELECT COUNT(*) as count FROM users'))[0].count;
    const activeListings = (await query('SELECT COUNT(*) as count FROM car_listings WHERE status = "active"'))[0].count;
    const pendingApprovals = (await query('SELECT COUNT(*) as count FROM car_listings WHERE status = "pending"'))[0].count;
    const soldListings = (await query('SELECT COUNT(*) as count FROM car_listings WHERE status = "sold"'))[0].count;
    const totalVolume = (await query('SELECT COALESCE(SUM(price), 0) as total FROM car_listings WHERE status IN ("active", "sold")'))[0].total;
    const totalChats = (await query('SELECT COUNT(*) as count FROM chats'))[0].count;
    const totalViews = (await query('SELECT COALESCE(SUM(views_count), 0) as views FROM car_listings'))[0].views;

    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        activeListings,
        pendingApprovals,
        soldListings,
        totalMarketValue: totalVolume,
        totalChats,
        totalViews
      }
    });
  } catch (err) {
    logger.error('ADMIN', 'GET_STATS_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/listings (Cached in Redis for 30s, supports server-side pagination)
router.get('/listings', redisCache.middleware('admin:listings', 30), async (req, res) => {
  try {
    const { status, search } = req.query;
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    let baseWhere = 'WHERE 1=1';
    const whereParams = [];

    if (status && status !== 'all') {
      baseWhere += ' AND c.status = ?';
      whereParams.push(status);
    }

    if (search && search.trim()) {
      baseWhere += ' AND (c.title LIKE ? OR b.name LIKE ? OR u.name LIKE ?)';
      const term = `%${search.trim()}%`;
      whereParams.push(term, term, term);
    }

    // Count query
    const countSql = `
      SELECT COUNT(*) as total
      FROM car_listings c
      JOIN brands b ON c.brand_id = b.id
      JOIN users u ON c.user_id = u.id
      ${baseWhere}
    `;
    const total = (await query(countSql, whereParams))[0]?.total || 0;

    let sql = `
      SELECT c.*, b.name AS brand_name, u.name AS seller_name, u.phone AS seller_phone,
             (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id LIMIT 1) AS primary_image
      FROM car_listings c
      JOIN brands b ON c.brand_id = b.id
      JOIN users u ON c.user_id = u.id
      ${baseWhere}
      ORDER BY c.id DESC
    `;
    const params = [...whereParams];

    if (hasPagination) {
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const listings = await query(sql, params);
    listings.forEach(l => {
      if (!l.primary_image) l.primary_image = '/assets/cars/creta.jpg';
    });

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/listings/:id/approve
router.patch('/listings/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE car_listings SET status = "active" WHERE id = ?', [id]);
    
    // Notify seller
    const car = (await query('SELECT user_id, title FROM car_listings WHERE id = ?', [id]))[0];
    if (car) {
      await query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [car.user_id, 'Listing Approved', `Your vehicle listing "${car.title}" has been approved by admin!`, 'listings']
      );
    }

    logger.admin('LISTING_APPROVED', `Admin approved listing #${id} (${car ? car.title : ''})`);
    await redisCache.delByPattern('admin:*');
    await redisCache.delByPattern('cars:*');
    res.json({ success: true, message: 'Listing approved and is now Active' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/listings/:id/reject
router.patch('/listings/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE car_listings SET status = "rejected" WHERE id = ?', [id]);
    
    logger.admin('LISTING_REJECTED', `Admin rejected listing #${id}`);
    await redisCache.delByPattern('admin:*');
    await redisCache.delByPattern('cars:*');
    res.json({ success: true, message: 'Listing rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/listings/:id/toggle-feature
router.patch('/listings/:id/toggle-feature', async (req, res) => {
  try {
    const { id } = req.params;
    const car = (await query('SELECT is_featured, title FROM car_listings WHERE id = ?', [id]))[0];
    if (!car) return res.status(404).json({ success: false, message: 'Listing not found' });

    const newFeatured = car.is_featured ? 0 : 1;
    await query('UPDATE car_listings SET is_featured = ? WHERE id = ?', [newFeatured, id]);

    logger.admin('FEATURE_TOGGLE', `Listing #${id} featured status set to ${newFeatured}`);
    await redisCache.delByPattern('admin:*');
    await redisCache.delByPattern('cars:*');
    res.json({ success: true, isFeatured: Boolean(newFeatured) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Ensure orders and bookings tables exist safely
async function ensureOrdersAndBookingsTables() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        car_id INT,
        buyer_id INT,
        token_amount DECIMAL(10,2) DEFAULT 0,
        total_price DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Token Confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS test_drive_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT,
        user_id INT,
        booking_date DATE,
        booking_time VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.warn('[Orders/Bookings Init]', err.message);
  }
}
ensureOrdersAndBookingsTables();

// GET /api/admin/users (Dual-Role Buyer & Seller analytics with server-side pagination)
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;
    const { search, status, mode } = req.query;

    let baseWhere = 'WHERE 1=1';
    const whereParams = [];

    if (status && status !== 'all' && status !== 'ALL') {
      baseWhere += ' AND u.status = ?';
      whereParams.push(status);
    }

    if (search && search.trim()) {
      baseWhere += ' AND (u.name LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)';
      const term = `%${search.trim()}%`;
      whereParams.push(term, term, term);
    }

    if (mode && mode !== 'all' && mode !== 'ALL') {
      if (mode === 'dual') {
        baseWhere += ' AND EXISTS (SELECT 1 FROM car_listings cl WHERE cl.user_id = u.id) AND (EXISTS (SELECT 1 FROM favorites f WHERE f.user_id = u.id) OR EXISTS (SELECT 1 FROM chats ch WHERE ch.buyer_id = u.id) OR u.role = "customer")';
      } else if (mode === 'seller') {
        baseWhere += ' AND EXISTS (SELECT 1 FROM car_listings cl WHERE cl.user_id = u.id)';
      } else if (mode === 'buyer') {
        baseWhere += ' AND NOT EXISTS (SELECT 1 FROM car_listings cl WHERE cl.user_id = u.id)';
      }
    }

    // Total count query for server-side pagination
    const countSql = `SELECT COUNT(*) as total FROM users u ${baseWhere}`;
    const total = (await query(countSql, whereParams))[0]?.total || 0;

    // Data query with listings and buyer activities
    const sql = `
      SELECT u.*,
             (SELECT COUNT(*) FROM car_listings cl WHERE cl.user_id = u.id) as listings_count,
             (SELECT COUNT(*) FROM favorites f WHERE f.user_id = u.id) as favorites_count,
             (SELECT COUNT(*) FROM chats ch WHERE ch.buyer_id = u.id) as buyer_chats_count,
             (SELECT COUNT(*) FROM chats ch WHERE ch.seller_id = u.id) as seller_chats_count
      FROM users u
      ${baseWhere}
      ORDER BY u.id DESC
      LIMIT ? OFFSET ?
    `;
    const params = [...whereParams, limit, offset];

    const users = await query(sql, params);
    const enrichedUsers = users.map(u => {
      const listings = Number(u.listings_count || 0);
      const buyerActivity = Number(u.favorites_count || 0) + Number(u.buyer_chats_count || 0);
      const isSeller = listings > 0;
      const isBuyer = buyerActivity > 0 || u.role === 'customer';

      let userMode = 'Dual Enabled (Buyer & Seller)';
      if (isSeller && buyerActivity > 0) userMode = 'Dual (Buyer & Seller)';
      else if (isSeller) userMode = 'Seller (Has Inventory)';
      else if (buyerActivity > 0) userMode = 'Buyer (Active Enquiries)';
      else userMode = 'Dual Enabled (New Member)';

      return {
        ...u,
        is_seller: isSeller,
        is_buyer: isBuyer,
        user_mode: userMode
      };
    });

    const finalUsers = enrichedUsers;
    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      users: finalUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id/toggle-block
router.patch('/users/:id/toggle-block', async (req, res) => {
  try {
    const { id } = req.params;
    const user = (await query('SELECT status, name FROM users WHERE id = ?', [id]))[0];
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    await query('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);

    logger.admin('USER_STATUS_CHANGE', `User #${id} (${user.name}) status changed to ${newStatus}`);
    res.json({ success: true, status: newStatus, isBlocked: newStatus === 'blocked' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Ensure categories table exists
async function ensureCategoriesTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(50) DEFAULT '🚙',
        description VARCHAR(255) DEFAULT '',
        popular_models VARCHAR(255) DEFAULT '',
        avg_budget VARCHAR(100) DEFAULT '',
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const count = (await query('SELECT COUNT(*) as cnt FROM categories'))[0].cnt;
    if (count === 0) {
      const defaults = [
        ['SUV', '🚙', 'Sport Utility Vehicles with high ground clearance and dominant stance', 'Creta, Thar, Scorpio, Nexon', '₹ 9 - 25 Lakh'],
        ['Sedan', '🏎️', 'Comfortable 3-box passenger cars offering supreme highway stability', 'City, Verna, Dzire, Ciaz', '₹ 6 - 18 Lakh'],
        ['Hatchback', '🚗', 'Compact agile runabouts ideal for city commute and parking', 'Swift, Baleno, i20, Altroz', '₹ 4 - 10 Lakh'],
        ['MUV / MPV', '🚐', 'Spacious multi-utility 7-seater vehicles for large families', 'Innova, Ertiga, Carens, Triber', '₹ 8 - 28 Lakh'],
        ['Electric EV', '⚡', 'Zero-emission green electric powertrains with fast charging', 'Nexon EV, Tiago EV, ZS EV, Ioniq 5', '₹ 8 - 45 Lakh'],
        ['Luxury Coupe', '👑', 'Premium executive performance and German engineering', 'BMW 3-Series, Mercedes C-Class, Audi A4', '₹ 35 - 90 Lakh']
      ];
      for (const d of defaults) {
        await query('INSERT INTO categories (name, icon, description, popular_models, avg_budget) VALUES (?, ?, ?, ?, ?)', d);
      }
    }
  } catch (err) {
    console.warn('[Categories Table Init]', err.message);
  }
}
ensureCategoriesTable();

// Ensure is_active columns exist on brands and cities tables
async function ensureActiveColumns() {
  try {
    const brandsCols = await query('SHOW COLUMNS FROM brands LIKE "is_active"');
    if (!brandsCols || brandsCols.length === 0) {
      await query('ALTER TABLE brands ADD COLUMN is_active TINYINT DEFAULT 1');
    }
    const citiesCols = await query('SHOW COLUMNS FROM cities LIKE "is_active"');
    if (!citiesCols || citiesCols.length === 0) {
      await query('ALTER TABLE cities ADD COLUMN is_active TINYINT DEFAULT 1');
    }
  } catch (err) {
    console.warn('[ensureActiveColumns]', err.message);
  }
}
ensureActiveColumns();

// -------------------------------------------------------------
// 1. BRANDS CRUD
// -------------------------------------------------------------
// GET /api/admin/brands (Get all brands for admin management)
router.get('/brands', async (req, res) => {
  try {
    const brands = await query('SELECT * FROM brands ORDER BY id ASC');
    res.json({ success: true, brands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/brands (Add new brand)
router.post('/brands', async (req, res) => {
  try {
    const { name, isPopular, logoIcon, country, isActive } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Brand name is required' });

    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    const result = await query(
      'INSERT INTO brands (name, is_popular, logo_icon, is_active) VALUES (?, ?, ?, ?)',
      [name.trim(), isPopular ? 1 : 0, logoIcon || '🚗', activeVal]
    );

    logger.admin('BRAND_CREATED', `Added new car brand: ${name} (Active: ${activeVal})`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, brandId: result.insertId, message: 'Brand created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/brands/:id (Edit brand)
router.put('/brands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isPopular, logoIcon, isActive } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Brand name is required' });

    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    await query(
      'UPDATE brands SET name = ?, is_popular = ?, logo_icon = ?, is_active = ? WHERE id = ?',
      [name.trim(), isPopular ? 1 : 0, logoIcon || '🚗', activeVal, id]
    );

    logger.admin('BRAND_UPDATED', `Updated car brand #${id}: ${name} (Active: ${activeVal})`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, message: 'Brand updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/brands/:id/toggle-status (Toggle active/deactive)
router.patch('/brands/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const brand = (await query('SELECT is_active, name FROM brands WHERE id = ?', [id]))[0];
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

    const newStatus = brand.is_active === 0 ? 1 : 0;
    await query('UPDATE brands SET is_active = ? WHERE id = ?', [newStatus, id]);

    logger.admin('BRAND_STATUS_TOGGLE', `Brand #${id} (${brand.name}) status changed to ${newStatus ? 'active' : 'deactive'}`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, isActive: newStatus, message: `Brand is now ${newStatus ? 'active' : 'deactive'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/brands/:id (Delete brand)
router.delete('/brands/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM brands WHERE id = ?', [id]);
    logger.admin('BRAND_DELETED', `Deleted brand #${id}`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 2. CATEGORIES / BODY TYPES CRUD
// -------------------------------------------------------------
// GET /api/admin/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/categories
router.post('/categories', async (req, res) => {
  try {
    const { name, icon, description, popularModels, avgBudget, isActive } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    const result = await query(
      'INSERT INTO categories (name, icon, description, popular_models, avg_budget, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), icon || '🚙', description || '', popularModels || '', avgBudget || '', activeVal]
    );

    logger.admin('CATEGORY_CREATED', `Added new category: ${name}`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, categoryId: result.insertId, message: 'Category added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/categories/:id
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, popularModels, avgBudget, isActive } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    await query(
      'UPDATE categories SET name = ?, icon = ?, description = ?, popular_models = ?, avg_budget = ?, is_active = ? WHERE id = ?',
      [name.trim(), icon || '🚙', description || '', popularModels || '', avgBudget || '', activeVal, id]
    );

    logger.admin('CATEGORY_UPDATED', `Updated category #${id}: ${name} (Active: ${activeVal})`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/categories/:id/toggle-status (Toggle active/deactive)
router.patch('/categories/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const cat = (await query('SELECT is_active, name FROM categories WHERE id = ?', [id]))[0];
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

    const newStatus = cat.is_active === 0 ? 1 : 0;
    await query('UPDATE categories SET is_active = ? WHERE id = ?', [newStatus, id]);

    logger.admin('CATEGORY_STATUS_TOGGLE', `Category #${id} (${cat.name}) status changed to ${newStatus ? 'active' : 'deactive'}`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, isActive: newStatus, message: `Category is now ${newStatus ? 'active' : 'deactive'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM categories WHERE id = ?', [id]);
    logger.admin('CATEGORY_DELETED', `Deleted category #${id}`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 3. CITIES / TERRITORIES CRUD
// -------------------------------------------------------------
// GET /api/admin/cities (Get all cities for admin management)
router.get('/cities', async (req, res) => {
  try {
    const cities = await query('SELECT * FROM cities ORDER BY id ASC');
    res.json({ success: true, cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/cities (Add new location)
router.post('/cities', async (req, res) => {
  try {
    const { name, state, isPopular, isActive } = req.body;
    if (!name || !state) return res.status(400).json({ success: false, message: 'City and state are required' });

    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    const result = await query(
      'INSERT INTO cities (name, state, is_popular, is_active) VALUES (?, ?, ?, ?)',
      [name.trim(), state.trim(), isPopular ? 1 : 0, activeVal]
    );

    logger.admin('CITY_CREATED', `Added new city: ${name}, ${state} (Active: ${activeVal})`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, cityId: result.insertId, message: 'City created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/cities/:id (Edit city)
router.put('/cities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, state, isPopular, isActive } = req.body;
    if (!name || !state) return res.status(400).json({ success: false, message: 'City and state are required' });

    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    await query(
      'UPDATE cities SET name = ?, state = ?, is_popular = ?, is_active = ? WHERE id = ?',
      [name.trim(), state.trim(), isPopular ? 1 : 0, activeVal, id]
    );

    logger.admin('CITY_UPDATED', `Updated city #${id}: ${name}, ${state} (Active: ${activeVal})`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, message: 'City updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/cities/:id/toggle-status (Toggle active/deactive)
router.patch('/cities/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const city = (await query('SELECT is_active, name, state FROM cities WHERE id = ?', [id]))[0];
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });

    const newStatus = city.is_active === 0 ? 1 : 0;
    await query('UPDATE cities SET is_active = ? WHERE id = ?', [newStatus, id]);

    logger.admin('CITY_STATUS_TOGGLE', `City #${id} (${city.name}) status changed to ${newStatus ? 'active' : 'deactive'}`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, isActive: newStatus, message: `City is now ${newStatus ? 'active' : 'deactive'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/cities/:id (Delete city)
router.delete('/cities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM cities WHERE id = ?', [id]);
    logger.admin('CITY_DELETED', `Deleted city #${id}`);
    await redisCache.delByPattern('meta:*');
    res.json({ success: true, message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

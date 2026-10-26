const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const logger = require('../services/logger');
const redisCache = require('../services/redisCache');

// GET /api/cars (Cached in Redis for 60s)
router.get('/', redisCache.middleware('cars:list', 60), async (req, res) => {
  try {
    const {
      q,
      brand,
      model,
      city,
      minPrice,
      maxPrice,
      yearFrom,
      yearTo,
      fuel,
      transmission,
      tab, // 'all', 'used', 'new', 'certified'
      status = 'active',
      featured,
      sort = 'latest',
      userId
    } = req.query;

    let whereSql = ' WHERE 1=1';
    const whereParams = [];

    if (status && status !== 'all') {
      whereSql += ' AND c.status = ?';
      whereParams.push(status);
    }

    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      whereSql += ' AND (c.title LIKE ? OR b.name LIKE ? OR c.model_name LIKE ? OR c.reg_city LIKE ?)';
      whereParams.push(term, term, term, term);
    }

    if (brand) {
      if (isNaN(brand)) {
        whereSql += ' AND b.name = ?';
        whereParams.push(brand);
      } else {
        whereSql += ' AND c.brand_id = ?';
        whereParams.push(parseInt(brand, 10));
      }
    }

    if (model) {
      whereSql += ' AND c.model_name = ?';
      whereParams.push(model);
    }

    if (city && city.trim()) {
      const trimmedCity = city.trim();
      const primaryCity = trimmedCity.split(',')[0].replace(/\b(NCR|Metro)\b/gi, '').trim();
      if (/bengaluru|bangalore/i.test(trimmedCity)) {
        whereSql += ' AND (c.reg_city LIKE ? OR c.reg_city LIKE ?)';
        whereParams.push('%Bangalore%', '%Bengaluru%');
      } else {
        whereSql += ' AND (c.reg_city LIKE ? OR c.reg_city LIKE ?)';
        whereParams.push(`%${trimmedCity}%`, `%${primaryCity}%`);
      }
    }

    if (minPrice) {
      whereSql += ' AND c.price >= ?';
      whereParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      whereSql += ' AND c.price <= ?';
      whereParams.push(parseFloat(maxPrice));
    }

    if (yearFrom) {
      whereSql += ' AND c.manufacturing_year >= ?';
      whereParams.push(parseInt(yearFrom, 10));
    }

    if (yearTo) {
      whereSql += ' AND c.manufacturing_year <= ?';
      whereParams.push(parseInt(yearTo, 10));
    }

    if (fuel) {
      whereSql += ' AND c.fuel_type = ?';
      whereParams.push(fuel);
    }

    if (transmission) {
      whereSql += ' AND c.transmission = ?';
      whereParams.push(transmission);
    }

    if (tab === 'certified') {
      whereSql += ' AND c.is_certified = 1';
    } else if (tab === 'new') {
      whereSql += ' AND c.manufacturing_year >= 2023 AND c.km_driven < 10000';
    } else if (tab === 'used') {
      whereSql += ' AND c.km_driven >= 10000';
    }

    if (featured === '1' || featured === 1) {
      whereSql += ' AND c.is_featured = 1';
    }

    // Sorting
    let orderSql = ' ORDER BY c.id DESC';
    switch (sort) {
      case 'price_asc':
        orderSql = ' ORDER BY c.price ASC';
        break;
      case 'price_desc':
        orderSql = ' ORDER BY c.price DESC';
        break;
      case 'year_desc':
        orderSql = ' ORDER BY c.manufacturing_year DESC';
        break;
      case 'km_asc':
        orderSql = ' ORDER BY c.km_driven ASC';
        break;
      case 'latest':
      default:
        orderSql = ' ORDER BY c.id DESC';
        break;
    }

    // Server-side Pagination support
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 12));
    const offset = (page - 1) * limit;

    let total = 0;
    if (hasPagination) {
      const countSql = `
        SELECT COUNT(*) as total
        FROM car_listings c
        JOIN brands b ON c.brand_id = b.id
        JOIN users u ON c.user_id = u.id
        ${whereSql}
      `;
      const countResult = await query(countSql, whereParams);
      total = countResult[0]?.total || 0;
    }

    let sql = `
      SELECT c.*, b.name AS brand_name, b.logo_icon AS brand_icon,
             u.name AS seller_name, u.phone AS seller_phone, u.avatar AS seller_avatar, u.rating AS seller_rating, u.is_verified AS seller_verified,
             (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id ORDER BY ci.is_primary DESC, ci.id ASC LIMIT 1) AS primary_image,
             (SELECT COUNT(*) FROM favorites f WHERE f.listing_id = c.id AND f.user_id = ?) AS is_favorited
      FROM car_listings c
      JOIN brands b ON c.brand_id = b.id
      JOIN users u ON c.user_id = u.id
      ${whereSql}
      ${orderSql}
    `;
    const params = [userId || 0, ...whereParams];

    if (hasPagination) {
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const cars = await query(sql, params);

    // Fallback image if primary_image is null
    cars.forEach(car => {
      if (!car.primary_image) {
        car.primary_image = '/assets/cars/creta.jpg';
      }
      car.is_favorited = Boolean(car.is_favorited);
    });

    const totalPages = hasPagination ? (Math.ceil(total / limit) || 1) : 1;

    res.json({
      success: true,
      count: cars.length,
      cars,
      pagination: {
        page,
        limit,
        total: hasPagination ? total : cars.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    logger.error('MARKETPLACE', 'GET_CARS_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cars/:id (Cached in Redis for 60s)
router.get('/:id', redisCache.middleware('cars:detail', 60), async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const carRows = await query(
      `SELECT c.*, b.name AS brand_name, b.logo_icon AS brand_icon,
              u.id AS seller_id, u.name AS seller_name, u.phone AS seller_phone, u.avatar AS seller_avatar,
              u.rating AS seller_rating, u.is_verified AS seller_verified, u.created_at AS seller_joined,
              (SELECT COUNT(*) FROM car_listings WHERE user_id = u.id AND status = 'active') AS seller_active_listings,
              (SELECT COUNT(*) FROM favorites f WHERE f.listing_id = c.id AND f.user_id = ?) AS is_favorited
       FROM car_listings c
       JOIN brands b ON c.brand_id = b.id
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [userId || 0, id]
    );

    if (!carRows || carRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle listing not found' });
    }

    const car = carRows[0];
    car.is_favorited = Boolean(car.is_favorited);

    // Increment view count
    await query('UPDATE car_listings SET views_count = views_count + 1 WHERE id = ?', [id]);

    // Fetch images
    const images = await query(
      'SELECT id, image_url, is_primary FROM car_images WHERE listing_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC',
      [id]
    );

    car.images = images.length > 0 ? images.map(img => img.image_url) : ['/assets/cars/creta.jpg'];

    logger.info('MARKETPLACE', 'VIEW_CAR', `User viewed car #${id}: ${car.title}`, {
      userId,
      ip: req.ip
    });

    res.json({ success: true, car });
  } catch (err) {
    logger.error('MARKETPLACE', 'GET_CAR_DETAILS_ERROR', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cars (Create new listing linked to user)
router.post('/', async (req, res) => {
  try {
    let {
      userId,
      brandId,
      brand,
      brandName: propBrandName,
      model,
      modelName,
      year,
      manufacturingYear,
      regYear,
      city,
      regCity,
      price,
      kmDriven,
      km_driven,
      fuelType,
      fuel_type,
      transmission,
      ownership = '1st Owner',
      title,
      description,
      images = []
    } = req.body;

    // Resolve User ID
    let targetUserId = userId || req.headers['x-user-id'] || 1;
    if (isNaN(targetUserId)) {
      const cleanPhone = String(targetUserId).replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        const u = (await query('SELECT id, status FROM users WHERE phone = ?', [cleanPhone]))[0];
        if (u) {
          targetUserId = u.id;
          if (u.status === 'blocked') {
            return res.status(403).json({ success: false, isBlocked: true, message: 'Your account has been suspended by administrator.' });
          }
        }
      }
    } else {
      const user = (await query('SELECT status FROM users WHERE id = ?', [targetUserId]))[0];
      if (user && user.status === 'blocked') {
        return res.status(403).json({ success: false, isBlocked: true, message: 'Your account has been suspended by administrator.' });
      }
    }

    // Resolve Brand ID
    let finalBrandId = brandId ? parseInt(brandId, 10) : null;
    const bName = brand || propBrandName;
    if (!finalBrandId && bName) {
      const brandRow = (await query('SELECT id FROM brands WHERE name = ?', [bName]))[0];
      if (brandRow) {
        finalBrandId = brandRow.id;
      } else {
        const insB = await query('INSERT INTO brands (name, logo_icon, is_popular) VALUES (?, ?, 1)', [bName, '🚗']);
        finalBrandId = insB.insertId;
      }
    }
    if (!finalBrandId) finalBrandId = 1; // Default to Maruti/first brand

    const finalModel = modelName || model || 'Vehicle';
    const finalPrice = parseFloat(price) || 500000;
    const finalKm = parseInt(kmDriven || km_driven || 20000, 10);
    const finalYear = parseInt(manufacturingYear || year || 2022, 10);
    const finalRegYear = parseInt(regYear || finalYear, 10);
    const finalCity = regCity || city || 'Jaipur, Rajasthan';
    const finalFuel = fuelType || fuel_type || 'Petrol';
    const finalTrans = transmission || 'Manual';

    // Get brand name
    const brandRow = (await query('SELECT name FROM brands WHERE id = ?', [finalBrandId]))[0];
    const resolvedBrandName = brandRow ? brandRow.name : 'Car';

    const finalTitle = title || `${resolvedBrandName} ${finalModel} ${finalYear}`;

    // Insert listing
    const result = await query(
      `INSERT INTO car_listings 
       (user_id, brand_id, model_name, manufacturing_year, reg_year, reg_city, price, km_driven, fuel_type, transmission, ownership, title, description, status, is_featured, is_certified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, 1)`,
      [
        targetUserId,
        finalBrandId,
        finalModel,
        finalYear,
        finalRegYear,
        finalCity,
        finalPrice,
        finalKm,
        finalFuel,
        finalTrans,
        ownership,
        finalTitle,
        description || `Well maintained ${resolvedBrandName} ${finalModel} ${finalYear}. Single owner with full service records.`
      ]
    );

    const listingId = result.insertId;

    // Attach images
    const imageList = Array.isArray(images) && images.length > 0 ? images : ['/assets/cars/creta.jpg'];
    for (let i = 0; i < imageList.length; i++) {
      await query(
        'INSERT INTO car_images (listing_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
        [listingId, imageList[i], i === 0 ? 1 : 0, i]
      );
    }

    // Log action
    logger.car('LISTING_CREATED', `New car listing #${listingId} published: ${finalTitle} (₹${Number(finalPrice).toLocaleString('en-IN')})`, {
      userId: targetUserId,
      ip: req.ip
    });

    // Notify user
    await query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [targetUserId, 'Listing Published', `Your ${finalTitle} is now live on SellBuy!`, 'listings']
    );

    // Invalidate Redis caches
    await redisCache.delByPattern('cars:*');
    await redisCache.delByPattern('admin:*');

    // Fetch created car with joins
    const [createdCar] = await query(
      `SELECT c.*, b.name AS brand_name, b.logo_icon AS brand_icon,
              u.name AS seller_name, u.phone AS seller_phone, u.avatar AS seller_avatar, u.rating AS seller_rating, u.is_verified AS seller_verified,
              (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id ORDER BY ci.is_primary DESC, ci.id ASC LIMIT 1) AS primary_image
       FROM car_listings c
       JOIN brands b ON c.brand_id = b.id
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [listingId]
    );
    if (createdCar) {
      createdCar.images = imageList;
      createdCar.formattedPrice = '₹ ' + Number(createdCar.price).toLocaleString('en-IN');
    }

    res.json({
      success: true,
      message: 'Car listing published successfully!',
      listingId,
      car: createdCar
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cars/:id (Edit listing)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      price,
      kmDriven,
      description,
      title,
      transmission,
      fuelType,
      regCity,
      status
    } = req.body;

    await query(
      `UPDATE car_listings 
       SET price = COALESCE(?, price),
           km_driven = COALESCE(?, km_driven),
           description = COALESCE(?, description),
           title = COALESCE(?, title),
           transmission = COALESCE(?, transmission),
           fuel_type = COALESCE(?, fuel_type),
           reg_city = COALESCE(?, reg_city),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [price, kmDriven, description, title, transmission, fuelType, regCity, status, id]
    );

    logger.car('LISTING_UPDATED', `Listing #${id} updated: Price: ₹${price || 'unchanged'}`, {
      ip: req.ip
    });

    // Invalidate Redis caches
    await redisCache.delByPattern('cars:*');
    await redisCache.delByPattern('admin:*');

    res.json({ success: true, message: 'Listing updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cars/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM car_images WHERE listing_id = ?', [id]);
    await query('DELETE FROM favorites WHERE listing_id = ?', [id]);
    await query('DELETE FROM car_listings WHERE id = ?', [id]);

    logger.car('LISTING_DELETED', `Listing #${id} was deleted`, { ip: req.ip });
    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/cars/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active', 'pending', 'sold', 'rejected'

    await query('UPDATE car_listings SET status = ? WHERE id = ?', [status, id]);
    logger.car('STATUS_CHANGED', `Listing #${id} status changed to ${status}`);

    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cars/:id/favorite (Toggle favorite)
router.post('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    let { userId } = req.body;

    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });

    let targetUserId = userId;
    if (isNaN(userId)) {
      const cleanPhone = String(userId).replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        const u = (await query('SELECT id, status FROM users WHERE phone = ?', [cleanPhone]))[0];
        if (u) targetUserId = u.id;
      }
    }

    const user = (await query('SELECT status FROM users WHERE id = ?', [targetUserId]))[0];
    if (user && user.status === 'blocked') {
      return res.status(403).json({ success: false, isBlocked: true, message: 'Your account has been suspended by administrator.' });
    }

    const existing = await query('SELECT id FROM favorites WHERE user_id = ? AND listing_id = ?', [targetUserId, id]);

    let isFavorited = false;
    if (existing.length > 0) {
      await query('DELETE FROM favorites WHERE user_id = ? AND listing_id = ?', [targetUserId, id]);
      isFavorited = false;
      logger.info('MARKETPLACE', 'UNFAVORITE_CAR', `User #${targetUserId} removed car #${id} from saved list`);
    } else {
      await query('INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)', [targetUserId, id]);
      isFavorited = true;
      logger.info('MARKETPLACE', 'FAVORITE_CAR', `User #${targetUserId} saved car #${id}`);
    }

    // Return current count and list of favorited car ids
    const allFavs = await query('SELECT listing_id FROM favorites WHERE user_id = ?', [targetUserId]);
    const savedCarIds = allFavs.map(f => String(f.listing_id));

    res.json({ success: true, isFavorited, savedCarIds, savedCount: savedCarIds.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cars/user/:userId (User's listings by tab: active, pending, sold)
router.get('/user/:userId', async (req, res) => {
  try {
    let { userId } = req.params;
    const { status } = req.query; // 'active', 'pending', 'sold', or all

    let targetUserId = userId;
    if (isNaN(userId)) {
      const cleanPhone = String(userId).replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        const userRow = (await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]))[0];
        if (userRow) targetUserId = userRow.id;
      }
    }

    let sql = `
      SELECT c.*, b.name AS brand_name,
             (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id ORDER BY ci.is_primary DESC, ci.id ASC LIMIT 1) AS primary_image
      FROM car_listings c
      JOIN brands b ON c.brand_id = b.id
      WHERE c.user_id = ?
    `;
    const params = [targetUserId];

    if (status && status !== 'all') {
      sql += ' AND c.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY c.id DESC';

    const listings = await query(sql, params);
    for (const l of listings) {
      if (!l.primary_image) l.primary_image = '/assets/cars/creta.jpg';
      l.formattedPrice = '₹ ' + Number(l.price).toLocaleString('en-IN');
      const imgs = await query('SELECT image_url FROM car_images WHERE listing_id = ? ORDER BY is_primary DESC, id ASC', [l.id]);
      l.images = imgs.length ? imgs.map(i => i.image_url) : [l.primary_image];
    }

    // Counts for tabs
    const counts = await query(
      `SELECT status, COUNT(*) as count FROM car_listings WHERE user_id = ? GROUP BY status`,
      [targetUserId]
    );

    const countsMap = { active: 0, pending: 0, sold: 0 };
    counts.forEach(row => {
      countsMap[row.status] = row.count;
    });

    res.json({
      success: true,
      counts: countsMap,
      listings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cars/user/:userId/saved (User's saved cars)
router.get('/user/:userId/saved', async (req, res) => {
  try {
    let { userId } = req.params;

    let targetUserId = userId;
    if (isNaN(userId)) {
      const cleanPhone = String(userId).replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        const userRow = (await query('SELECT id FROM users WHERE phone = ?', [cleanPhone]))[0];
        if (userRow) targetUserId = userRow.id;
      }
    }

    const sql = `
      SELECT c.*, b.name AS brand_name,
             (SELECT image_url FROM car_images ci WHERE ci.listing_id = c.id ORDER BY ci.is_primary DESC, ci.id ASC LIMIT 1) AS primary_image,
             1 AS is_favorited
      FROM favorites f
      JOIN car_listings c ON f.listing_id = c.id
      JOIN brands b ON c.brand_id = b.id
      WHERE f.user_id = ?
      ORDER BY f.id DESC
    `;

    const savedCars = await query(sql, [targetUserId]);
    for (const c of savedCars) {
      if (!c.primary_image) c.primary_image = '/assets/cars/creta.jpg';
      c.is_favorited = true;
      c.formattedPrice = '₹ ' + Number(c.price).toLocaleString('en-IN');
      const imgs = await query('SELECT image_url FROM car_images WHERE listing_id = ? ORDER BY is_primary DESC, id ASC', [c.id]);
      c.images = imgs.length ? imgs.map(i => i.image_url) : [c.primary_image];
    }

    res.json({
      success: true,
      savedCars,
      savedCarIds: savedCars.map(c => String(c.id)),
      count: savedCars.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
